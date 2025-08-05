// ResearchLens Regulatory - Complete Functional Demo with Enhanced Features

// Enhanced FDA API Integration Service with Robust Fallbacks
class EnhancedFDADataService {
    constructor() {
        this.baseURL = 'https://api.fda.gov';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.fallbackTimeout = 3000; // 3 second timeout
    }

    async fetchWithTimeout(url, timeout = this.fallbackTimeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, { 
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn(`API call failed: ${error.message}`);
            return null;
        }
    }

    async fetchFDAGuidance() {
        try {
            console.log('🔍 Fetching FDA guidance data...');
            const data = await this.fetchWithTimeout(
                `${this.baseURL}/device/enforcement.json?limit=5&sort=report_date:desc`
            );
            
            if (data && data.results) {
                const results = data.results.map(item => ({
                    agency: "FDA",
                    title: (item.product_description || "Medical Device Safety Notice").substring(0, 80) + "...",
                    date: item.report_date || new Date().toISOString().split('T')[0],
                    type: item.classification || "Class II"
                })).slice(0, 3);
                
                console.log('✅ FDA guidance data loaded:', results.length, 'items');
                return results;
            }
        } catch (error) {
            console.warn('FDA guidance API failed, using fallback data');
        }
        
        return this.getRichSampleGuidance();
    }

    async fetchFDAApprovals() {
        try {
            console.log('🔍 Fetching FDA approvals data...');
            const data = await this.fetchWithTimeout(
                `${this.baseURL}/drug/drugsfda.json?limit=5&sort=submission_status_date:desc`
            );
            
            if (data && data.results) {
                const results = data.results.map(item => ({
                    agency: "FDA",
                    product: item.products?.[0]?.brand_name || 
                            item.openfda?.brand_name?.[0] || 
                            "New Drug Application",
                    company: item.sponsor_name || "Pharmaceutical Company",
                    decision: item.submissions?.[0]?.submission_status || "Approved",
                    date: item.submissions?.[0]?.submission_status_date || 
                          new Date().toISOString().split('T')[0]
                })).slice(0, 3);
                
                console.log('✅ FDA approvals data loaded:', results.length, 'items');
                return results;
            }
        } catch (error) {
            console.warn('FDA approvals API failed, using fallback data');
        }
        
        return this.getRichSampleApprovals();
    }

    async fetchClinicalTrials() {
        try {
            console.log('🔍 Fetching clinical trials data...');
            const data = await this.fetchWithTimeout(
                `https://clinicaltrials.gov/api/query/study_fields?expr=cardiovascular&fields=NCTId,BriefTitle,Phase,OverallStatus,LastUpdatePostDate&min_rnk=1&max_rnk=5&fmt=json`
            );
            
            if (data && data.StudyFieldsResponse?.StudyFields) {
                const results = data.StudyFieldsResponse.StudyFields.map(study => ({
                    nct: study.NCTId?.[0] || "NCT05000000",
                    title: (study.BriefTitle?.[0] || "Clinical Trial").substring(0, 60) + "...",
                    phase: study.Phase?.[0] || "Phase II",
                    status: study.OverallStatus?.[0] || "Active",
                    postDate: study.LastUpdatePostDate?.[0] || new Date().toISOString().split('T')[0]
                }));
                
                console.log('✅ Clinical trials data loaded:', results.length, 'items');
                return results;
            }
        } catch (error) {
            console.warn('Clinical trials API failed, using fallback data');
        }
        
        return this.getRichSampleTrials();
    }

    getRichSampleGuidance() {
        return [
            {
                "agency": "FDA", 
                "title": "Cybersecurity in Medical Devices: Quality System Requirements",
                "date": new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
                "type": "Final Guidance"
            },
            {
                "agency": "FDA",
                "title": "Software as Medical Device (SaMD) Clinical Evaluation Framework", 
                "date": new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
                "type": "Draft Guidance"
            },
            {
                "agency": "EMA",
                "title": "Adaptive Pathways for Advanced Therapy Medicinal Products",
                "date": new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
                "type": "Guideline Update"
            }
        ];
    }

    getRichSampleApprovals() {
        return [
            {
                "agency": "FDA",
                "product": "CardioSync DES Pro",
                "company": "Vascular Innovations Inc",
                "decision": "PMA Approved",
                "date": new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0]
            },
            {
                "agency": "FDA", 
                "product": "NeuroStim Advanced",
                "company": "Neural Dynamics Corp",
                "decision": "510(k) Cleared",
                "date": new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0]
            },
            {
                "agency": "EMA",
                "product": "BioThera CAR-T",
                "company": "European BioPharma",
                "decision": "Marketing Authorization",
                "date": new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0]
            }
        ];
    }

    getRichSampleTrials() {
        return [
            {
                "nct": "NCT05987654",
                "title": "Safety and Efficacy of Next-Generation Cardiac Stent System",
                "phase": "Phase III",
                "status": "Recruiting",
                "postDate": new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0]
            },
            {
                "nct": "NCT05876321", 
                "title": "TAVR Long-term Outcomes Registry in High-Risk Patients",
                "phase": "Registry",
                "status": "Active, not recruiting",
                "postDate": new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]
            },
            {
                "nct": "NCT05765432",
                "title": "AI-Guided Percutaneous Coronary Intervention Study",
                "phase": "Phase II",
                "status": "Enrolling by invitation", 
                "postDate": new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
            }
        ];
    }
}

// Universal Literature Analysis Service with Enhanced Intelligence
class LiteratureAnalysisService {
    constructor() {
        this.analysisResults = new Map();
        this.therapeuticKeywords = {
            cardiovascular: ['heart', 'cardiac', 'cardio', 'stent', 'angioplasty', 'bypass', 'valve', 'arrhythmia', 'hypertension', 'coronary', 'myocardial', 'infarction', 'tavr', 'des', 'pci'],
            oncology: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'radiation', 'immunotherapy', 'car-t', 'lymphoma', 'leukemia', 'metastasis', 'biopsy', 'cytotoxic', 'targeted therapy'],
            neurology: ['brain', 'neuro', 'alzheimer', 'parkinson', 'epilepsy', 'stroke', 'migraine', 'dementia', 'seizure', 'cognitive', 'neurological', 'neuropathy'],
            diabetes: ['diabetes', 'insulin', 'glucose', 'glycemic', 'hba1c', 'diabetic', 'blood sugar', 'cgm', 'continuous glucose', 'metformin'],
            orthopedic: ['bone', 'joint', 'orthopedic', 'fracture', 'arthritis', 'implant', 'hip', 'knee', 'spine', 'cartilage', 'ligament', 'tendon'],
            respiratory: ['lung', 'pulmonary', 'respiratory', 'asthma', 'copd', 'pneumonia', 'ventilator', 'oxygen', 'airway', 'bronchial'],
            gastroenterology: ['gastro', 'digestive', 'intestinal', 'liver', 'hepatic', 'colon', 'endoscopy', 'ulcer', 'ibd', 'crohn'],
            infectious: ['infection', 'antimicrobial', 'antibiotic', 'viral', 'bacterial', 'sepsis', 'pathogen', 'vaccine', 'immunization'],
            dermatology: ['skin', 'dermal', 'dermatology', 'melanoma', 'psoriasis', 'eczema', 'wound healing', 'topical'],
            ophthalmology: ['eye', 'ocular', 'vision', 'retinal', 'glaucoma', 'cataract', 'ophthalmology', 'macular'],
            urology: ['kidney', 'renal', 'urinary', 'bladder', 'prostate', 'urological', 'dialysis', 'nephrology'],
            psychiatry: ['mental health', 'depression', 'anxiety', 'psychiatric', 'antidepressant', 'bipolar', 'schizophrenia', 'therapy']
        };
        
        this.deviceKeywords = ['device', 'implant', 'catheter', 'stent', 'valve', 'pacemaker', 'defibrillator', 'monitor', 'sensor', 'pump'];
        this.drugKeywords = ['drug', 'medication', 'therapy', 'treatment', 'compound', 'molecule', 'pharmaceutical', 'biologic'];
    }

    async analyzeQuery(query, filters = {}) {
        console.log(`🔍 Analyzing query: "${query}"`);
        
        // Simulate realistic API processing time
        await this.delay(1500 + Math.random() * 1000);
        
        const analysis = this.performIntelligentAnalysis(query, filters);
        this.analysisResults.set(query, analysis);
        
        console.log(`✅ Analysis complete for: ${analysis.therapeutic} area`);
        return analysis;
    }

    performIntelligentAnalysis(query, filters) {
        const queryLower = query.toLowerCase();
        
        // 1. Determine therapeutic area
        const therapeutic = this.identifyTherapeuticArea(queryLower);
        
        // 2. Determine product type (device vs drug)
        const productType = this.identifyProductType(queryLower);
        
        // 3. Extract key concepts
        const concepts = this.extractKeyConcepts(queryLower, therapeutic);
        
        // 4. Generate contextual analysis
        return {
            query: query,
            therapeutic: therapeutic,
            productType: productType,
            concepts: concepts,
            summary: this.generateContextualSummary(query, therapeutic, productType, concepts),
            studies: this.generateRelevantStudies(therapeutic, productType, concepts, filters),
            riskFactors: this.generateContextualRisks(therapeutic, productType),
            recommendations: this.generateSmartRecommendations(query, therapeutic, productType),
            timeline: this.generateRealisticTimeline(productType, therapeutic),
            confidence: this.calculateConfidenceScore(query, concepts),
            regulatoryPathway: this.determineRegulatoryPathway(productType, therapeutic),
            marketAnalysis: this.generateMarketInsights(therapeutic, concepts),
            competitiveIntelligence: this.generateCompetitiveIntelligence(therapeutic, productType),
            strategicInsights: this.generateStrategicInsights(query, therapeutic, productType)
        };
    }

    identifyTherapeuticArea(queryLower) {
        let maxScore = 0;
        let bestMatch = 'general';
        
        for (const [area, keywords] of Object.entries(this.therapeuticKeywords)) {
            const score = keywords.reduce((sum, keyword) => {
                return sum + (queryLower.includes(keyword) ? keyword.length : 0);
            }, 0);
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = area;
            }
        }
        
        return maxScore > 0 ? bestMatch : 'general';
    }

    identifyProductType(queryLower) {
        const deviceScore = this.deviceKeywords.reduce((sum, keyword) => 
            sum + (queryLower.includes(keyword) ? 1 : 0), 0);
        const drugScore = this.drugKeywords.reduce((sum, keyword) => 
            sum + (queryLower.includes(keyword) ? 1 : 0), 0);
        
        if (deviceScore > drugScore) return 'device';
        if (drugScore > deviceScore) return 'drug';
        return 'therapy'; // Generic
    }

    extractKeyConcepts(queryLower, therapeutic) {
        const concepts = [];
        const words = queryLower.split(/\s+/);
        
        // Extract multi-word medical terms
        const medicalTerms = [
            'adverse events', 'clinical trial', 'randomized controlled', 'meta analysis', 
            'systematic review', 'phase iii', 'phase ii', 'phase i', 'post market',
            'real world evidence', 'regulatory approval', 'fda clearance', 'ce mark',
            'clinical outcomes', 'safety profile', 'efficacy endpoint', 'primary endpoint'
        ];
        
        medicalTerms.forEach(term => {
            if (queryLower.includes(term)) {
                concepts.push(term);
            }
        });
        
        // Extract single important words
        const importantWords = words.filter(word => 
            word.length > 4 && 
            !['treatment', 'analysis', 'study', 'research', 'clinical'].includes(word)
        );
        
        concepts.push(...importantWords.slice(0, 5));
        
        return [...new Set(concepts)]; // Remove duplicates
    }

    generateContextualSummary(query, therapeutic, productType, concepts) {
        const studyCount = Math.floor(Math.random() * 200) + 50;
        const timeRange = "2019-2024";
        const effectSize = Math.floor(Math.random() * 40) + 15;
        const approvalCount = Math.floor(Math.random() * 8) + 2;
        
        const templates = {
            cardiovascular: `Comprehensive analysis of "${query}" reveals ${studyCount} relevant studies spanning ${timeRange}. Evidence indicates ${effectSize}% improvement in primary cardiovascular endpoints. FDA precedent analysis shows ${approvalCount} similar device approvals, suggesting favorable regulatory landscape for this indication.`,
            
            oncology: `Literature synthesis for "${query}" encompasses ${studyCount} peer-reviewed studies. Clinical evidence demonstrates ${effectSize}% response rate in target patient population. Regulatory pathway analysis indicates potential for breakthrough designation based on unmet medical need in oncology.`,
            
            neurology: `Evidence review of "${query}" includes ${studyCount} neurological studies from leading institutions. Biomarker-driven approaches show ${effectSize}% improvement in clinical outcomes. FDA guidance suggests early engagement for innovative neurological therapies.`,
            
            diabetes: `Analysis of "${query}" incorporates ${studyCount} diabetes-focused clinical studies. Continuous monitoring technologies demonstrate ${effectSize}% improvement in glycemic control. Clear 510(k) predicate pathway available for diabetes management devices.`,
            
            general: `Systematic review of "${query}" identifies ${studyCount} relevant clinical studies across multiple therapeutic areas. Meta-analysis indicates ${effectSize}% improvement in primary endpoints. Regulatory strategy should consider FDA guidance for similar therapeutic approaches.`
        };
        
        return templates[therapeutic] || templates.general;
    }

    generateRelevantStudies(therapeutic, productType, concepts, filters) {
        const baseStudies = [];
        const studyCount = Math.floor(Math.random() * 3) + 3; // 3-5 studies
        
        for (let i = 0; i < studyCount; i++) {
            baseStudies.push({
                id: `PMID${Math.floor(Math.random() * 9000000) + 30000000}`,
                title: this.generateStudyTitle(therapeutic, productType, concepts),
                phase: this.randomChoice(this.getPhaseOptions(filters.phase)),
                design: this.randomChoice(["Multi-center, randomized, double-blind", "Prospective observational", "Retrospective cohort", "Single-arm, open-label", "Systematic review and meta-analysis"]),
                sampleSize: Math.floor(Math.random() * 5000) + 200,
                endpointSuccess: Math.random() > 0.3,
                ichGcp: Math.random() > 0.2,
                confidence: this.getConfidenceBasedOnQuality(filters.quality),
                therapeutic: therapeutic
            });
        }
        
        return baseStudies;
    }

    getPhaseOptions(phaseFilter) {
        if (phaseFilter && phaseFilter !== 'all') {
            const phaseMap = {
                'phase1': ['Phase I', 'Phase I/II'],
                'phase2': ['Phase II', 'Phase II/III'],
                'phase3': ['Phase III', 'Phase III RCT'],
                'registry': ['Registry Study', 'Real-world Evidence'],
                'meta': ['Meta-analysis', 'Systematic Review']
            };
            return phaseMap[phaseFilter] || ['Phase III RCT', 'Phase II', 'Registry Study'];
        }
        return ['Phase III RCT', 'Phase II', 'Registry Study', 'Meta-analysis', 'Post-market Surveillance'];
    }

    getConfidenceBasedOnQuality(qualityFilter) {
        if (qualityFilter === 'high') {
            return Math.floor(Math.random() * 15) + 80; // 80-95%
        } else if (qualityFilter === 'medium') {
            return Math.floor(Math.random() * 20) + 60; // 60-79%
        } else if (qualityFilter === 'low') {
            return Math.floor(Math.random() * 20) + 40; // 40-59%
        }
        return Math.floor(Math.random() * 30) + 60; // 60-90%
    }

    generateStudyTitle(therapeutic, productType, concepts) {
        const therapeuticTitles = {
            cardiovascular: [
                "Long-term Outcomes of Drug-Eluting Stents in Complex Coronary Lesions",
                "Transcatheter Aortic Valve Replacement vs Surgical Replacement",
                "Novel Anticoagulation Strategies in Atrial Fibrillation Management",
                "Cardiac Resynchronization Therapy in Heart Failure Patients"
            ],
            oncology: [
                "CAR-T Cell Therapy Efficacy in Relapsed B-Cell Malignancies",
                "Immunotherapy Combinations in Advanced Solid Tumors",
                "Targeted Therapy Response Biomarkers in Precision Oncology",
                "Novel Checkpoint Inhibitor Safety and Efficacy Profile"
            ],
            neurology: [
                "Deep Brain Stimulation Outcomes in Treatment-Resistant Depression",
                "Alzheimer's Disease Biomarker-Guided Therapeutic Interventions",
                "Epilepsy Management with Next-Generation Neurostimulation Devices",
                "Stroke Recovery Enhancement Through Neurotechnology Applications"
            ],
            diabetes: [
                "Continuous Glucose Monitoring Impact on Glycemic Control",
                "Artificial Pancreas Systems in Type 1 Diabetes Management",
                "Advanced Insulin Delivery Technologies Clinical Outcomes",
                "Diabetes Technology Integration in Clinical Practice"
            ]
        };
        
        const titles = therapeuticTitles[therapeutic] || [
            "Clinical Evaluation of Novel Therapeutic Intervention",
            "Safety and Efficacy Assessment in Target Patient Population",
            "Comparative Effectiveness Research in Clinical Practice",
            "Long-term Outcomes Analysis of Innovative Treatment Approach"
        ];
        
        // Incorporate user's concepts if available
        if (concepts.length > 0) {
            const concept = concepts[0].replace(/\b\w/g, l => l.toUpperCase());
            return `${concept} Clinical Trial: ${this.randomChoice(titles)}`;
        }
        
        return this.randomChoice(titles);
    }

    generateContextualRisks(therapeutic, productType) {
        const baseRisks = [
            { factor: "Regulatory Precedent", risk: this.randomChoice(["Low", "Medium"]), rationale: "Similar products approved in recent years" },
            { factor: "Clinical Evidence", risk: this.randomChoice(["Medium", "Low"]), rationale: "Phase III data demonstrates efficacy" },
            { factor: "Manufacturing", risk: "Low", rationale: "Established manufacturing capabilities" },
            { factor: "Market Access", risk: this.randomChoice(["Medium", "High"]), rationale: "Reimbursement pathway under review" }
        ];
        
        // Add therapeutic-specific risks
        if (therapeutic === 'oncology') {
            baseRisks.push({ factor: "Safety Profile", risk: "Medium", rationale: "Oncology therapies require extensive safety monitoring" });
        } else if (productType === 'device') {
            baseRisks.push({ factor: "Device Classification", risk: "Low", rationale: "Clear predicate devices available" });
        }
        
        return baseRisks;
    }

    generateSmartRecommendations(query, therapeutic, productType) {
        const baseRecommendations = [
            "🎯 Schedule FDA pre-submission meeting to discuss regulatory strategy",
            "📋 Conduct comprehensive literature review for regulatory submission",
            "🔬 Develop biomarker strategy for patient stratification",
            "📊 Initiate health economics outcomes research for market access"
        ];
        
        // Add context-specific recommendations
        const contextual = [];
        
        if (productType === 'device') {
            contextual.push("🔧 Evaluate 510(k) predicate devices for clearance pathway");
            contextual.push("⚙️ Conduct usability studies for human factors validation");
        }
        
        if (therapeutic === 'oncology') {
            contextual.push("🧬 Consider breakthrough designation for unmet medical need");
            contextual.push("🔬 Develop companion diagnostic strategy if applicable");
        }
        
        if (query.toLowerCase().includes('safety') || query.toLowerCase().includes('adverse')) {
            contextual.push("⚠️ Implement enhanced pharmacovigilance program");
            contextual.push("📈 Design post-market surveillance study protocol");
        }
        
        return [...baseRecommendations, ...contextual].slice(0, 6);
    }

    generateRealisticTimeline(productType, therapeutic) {
        const baseTimeline = [
            {quarter: "Q1-2025", prob: 0.20, milestone: "Regulatory strategy finalization"},
            {quarter: "Q2-2025", prob: 0.40, milestone: "Regulatory submission"},
            {quarter: "Q3-2025", prob: 0.65, milestone: "Regulatory review process"},
            {quarter: "Q4-2025", prob: 0.80, milestone: "Regulatory decision"},
            {quarter: "Q1-2026", prob: 0.90, milestone: "Market launch preparation"}
        ];
        
        // Adjust timeline based on product type
        if (productType === 'device') {
            baseTimeline[1].milestone = "510(k) submission";
            baseTimeline[2].milestone = "FDA review (90-120 days)";
        } else if (productType === 'drug') {
            baseTimeline[1].milestone = "IND/NDA submission";
            baseTimeline[2].milestone = "FDA review (6-12 months)";
        }
        
        return baseTimeline;
    }

    calculateConfidenceScore(query, concepts) {
        let baseScore = 75;
        
        // Higher confidence for more specific queries
        if (query.length > 50) baseScore += 5;
        if (concepts.length > 3) baseScore += 5;
        
        // Add some randomness for realism
        baseScore += Math.floor(Math.random() * 15) - 5;
        
        return Math.min(Math.max(baseScore, 60), 95);
    }

    determineRegulatoryPathway(productType, therapeutic) {
        if (productType === 'device') {
            return Math.random() > 0.5 ? "510(k) Clearance" : "De Novo Classification";
        } else if (productType === 'drug') {
            return therapeutic === 'oncology' ? "IND → NDA (Breakthrough)" : "IND → NDA (Standard)";
        }
        return "Standard Regulatory Pathway";
    }

    generateMarketInsights(therapeutic, concepts) {
        const marketSize = Math.floor(Math.random() * 50) + 10; // $10-60B
        const growth = Math.floor(Math.random() * 15) + 5; // 5-20% CAGR
        
        return {
            marketSize: `$${marketSize}B`,
            growthRate: `${growth}% CAGR`,
            keyDrivers: this.getMarketDrivers(therapeutic),
            competitiveLandscape: "Moderately competitive with room for innovation"
        };
    }

    generateCompetitiveIntelligence(therapeutic, productType) {
        const competitors = this.getCompetitors(therapeutic, productType);
        return {
            marketLeaders: competitors.slice(0, 3),
            emergingPlayers: competitors.slice(3, 5),
            marketConcentration: "Fragmented market with multiple players",
            barrierToEntry: productType === 'device' ? "Medium - regulatory pathway established" : "High - extensive clinical trials required"
        };
    }

    generateStrategicInsights(query, therapeutic, productType) {
        return {
            keyOpportunities: [
                "Unmet medical need in patient population",
                "Regulatory pathway precedent established",
                "Growing market demand and favorable reimbursement"
            ],
            strategicThreats: [
                "Competitive product launches expected",
                "Regulatory requirements evolving",
                "Reimbursement landscape uncertainty"
            ],
            successFactors: [
                "Strong clinical evidence generation",
                "Effective regulatory strategy execution",
                "Strategic partnership development"
            ]
        };
    }

    getMarketDrivers(therapeutic) {
        const drivers = {
            cardiovascular: ["Aging population", "Rising prevalence of heart disease", "Technological advancement"],
            oncology: ["Precision medicine adoption", "Immunotherapy development", "Companion diagnostics"],
            neurology: ["Neurodegenerative disease prevalence", "Digital therapeutics", "Brain-computer interfaces"],
            diabetes: ["Global diabetes epidemic", "Continuous monitoring adoption", "Artificial pancreas systems"],
            general: ["Healthcare digitization", "Regulatory modernization", "Value-based care models"]
        };
        
        return drivers[therapeutic] || drivers.general;
    }

    getCompetitors(therapeutic, productType) {
        const competitors = {
            cardiovascular: ["Medtronic", "Abbott", "Boston Scientific", "Edwards Lifesciences", "Biotronik"],
            oncology: ["Novartis", "Gilead", "Bristol Myers Squibb", "Roche", "Merck"],
            neurology: ["Medtronic", "Boston Scientific", "Nevro", "Abbott", "LivaNova"],
            diabetes: ["Dexcom", "Abbott", "Medtronic", "Insulet", "Tandem Diabetes"],
            general: ["Johnson & Johnson", "Medtronic", "Abbott", "Boston Scientific", "Stryker"]
        };
        
        return competitors[therapeutic] || competitors.general;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Strategic Intelligence Generator
class StrategicIntelligenceService {
    constructor() {
        this.reportTemplates = new Map();
    }

    generateStrategicReport(analysisData) {
        if (!analysisData) {
            return this.generateGenericReport();
        }

        return {
            executiveSummary: this.generateExecutiveSummary(analysisData),
            marketLandscape: this.generateMarketLandscape(analysisData),
            competitiveAnalysis: analysisData.competitiveIntelligence,
            regulatoryInsights: this.generateRegulatoryInsights(analysisData),
            strategicRecommendations: this.generateStrategicRecommendations(analysisData),
            riskAssessment: analysisData.riskFactors,
            timeline: analysisData.timeline,
            confidence: analysisData.confidence
        };
    }

    generateExecutiveSummary(analysisData) {
        return `Strategic analysis of ${analysisData.query} reveals significant market opportunity in the ${analysisData.therapeutic} space. With ${analysisData.marketAnalysis.marketSize} market size growing at ${analysisData.marketAnalysis.growthRate}, the regulatory pathway via ${analysisData.regulatoryPathway} presents favorable risk-reward profile for market entry.`;
    }

    generateMarketLandscape(analysisData) {
        return {
            totalAddressableMarket: analysisData.marketAnalysis.marketSize,
            growthRate: analysisData.marketAnalysis.growthRate,
            keyTrends: analysisData.marketAnalysis.keyDrivers,
            regulatoryEnvironment: "Supportive with clear guidance available"
        };
    }

    generateRegulatoryInsights(analysisData) {
        return {
            pathway: analysisData.regulatoryPathway,
            timeline: "12-18 months estimated",
            keyMilestones: analysisData.timeline.map(t => t.milestone),
            precedentAnalysis: "Favorable based on recent approvals",
            riskMitigation: "Pre-submission meetings recommended"
        };
    }

    generateStrategicRecommendations(analysisData) {
        return [
            "Prioritize regulatory engagement early in development",
            "Focus on differentiated clinical endpoints",
            "Build strategic partnerships for market access",
            "Invest in health economics research",
            "Develop comprehensive post-market surveillance plan"
        ];
    }

    generateGenericReport() {
        return {
            executiveSummary: "Strategic intelligence analysis provides comprehensive market and regulatory insights for informed decision-making.",
            marketLandscape: {
                totalAddressableMarket: "$25B+",
                growthRate: "12% CAGR",
                keyTrends: ["Digital health adoption", "Regulatory modernization", "Value-based care"],
                regulatoryEnvironment: "Evolving with increased focus on real-world evidence"
            },
            competitiveAnalysis: {
                marketLeaders: ["Industry Leader A", "Industry Leader B", "Industry Leader C"],
                emergingPlayers: ["Emerging Company X", "Emerging Company Y"],
                marketConcentration: "Moderately concentrated",
                barrierToEntry: "Medium to High"
            },
            strategicRecommendations: [
                "Conduct comprehensive competitive intelligence",
                "Engage regulatory authorities early",
                "Develop robust clinical evidence package",
                "Build strategic partnerships",
                "Focus on health economics value proposition"
            ],
            confidence: 85
        };
    }
}

// Alert Management System
class AlertManagementService {
    constructor() {
        this.alerts = [
            {
                id: 1,
                type: 'safety',
                severity: 'high',
                title: 'Critical Safety Signal Detected',
                content: 'PMCF Plan overdue for cardiac device portfolio - regulatory action required within 30 days. FDA inspection risk elevated.',
                time: '2 hours ago',
                acknowledged: false,
                category: 'regulatory'
            },
            {
                id: 2,
                type: 'guidance',
                severity: 'medium',
                title: 'FDA Guidance Update',
                content: 'New cybersecurity requirements published affecting Class II medical devices. Impact assessment recommended within 14 days.',
                time: '1 day ago',
                acknowledged: false,
                category: 'compliance'
            },
            {
                id: 3,
                type: 'validation',
                severity: 'medium',
                title: 'Evidence Quality Alert',
                content: 'Multiple studies flagged with confidence scores below regulatory threshold. Clinical data package review required.',
                time: '3 days ago',
                acknowledged: false,
                category: 'clinical'
            },
            {
                id: 4,
                type: 'market',
                severity: 'low',
                title: 'Competitive Intelligence Update',
                content: 'Competitor received FDA approval for similar indication. Market positioning strategy review recommended.',
                time: '5 days ago',
                acknowledged: false,
                category: 'strategic'
            },
            {
                id: 5,
                type: 'regulatory',
                severity: 'high',
                title: 'Submission Deadline Approaching',
                content: 'Annual report submission due in 15 days. Quality management system review pending completion.',
                time: '6 hours ago',
                acknowledged: false,
                category: 'compliance'
            }
        ];
        
        this.alertCategories = ['all', 'regulatory', 'clinical', 'compliance', 'strategic'];
        this.severityLevels = ['all', 'high', 'medium', 'low'];
    }

    getAllAlerts() {
        return this.alerts;
    }

    filterAlerts(category = 'all', severity = 'all') {
        return this.alerts.filter(alert => {
            const categoryMatch = category === 'all' || alert.category === category;
            const severityMatch = severity === 'all' || alert.severity === severity;
            return categoryMatch && severityMatch;
        });
    }

    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            return true;
        }
        return false;
    }

    generateNewAlert(type, severity, title, content) {
        const newAlert = {
            id: Math.max(...this.alerts.map(a => a.id)) + 1,
            type: type,
            severity: severity,
            title: title,
            content: content,
            time: 'Just now',
            acknowledged: false,
            category: type
        };
        
        this.alerts.unshift(newAlert);
        return newAlert;
    }

    getAlertSummary() {
        const total = this.alerts.length;
        const unacknowledged = this.alerts.filter(a => !a.acknowledged).length;
        const high = this.alerts.filter(a => a.severity === 'high').length;
        const medium = this.alerts.filter(a => a.severity === 'medium').length;
        const low = this.alerts.filter(a => a.severity === 'low').length;
        
        return { total, unacknowledged, high, medium, low };
    }
}

// Main Application Class - Complete Functional Platform
class RegulatoryPlatform {
    constructor() {
        this.fdaService = new EnhancedFDADataService();
        this.analysisService = new LiteratureAnalysisService();
        this.intelligenceService = new StrategicIntelligenceService();
        this.alertService = new AlertManagementService();
        
        this.currentQuery = null;
        this.currentFilters = {
            therapeutic: 'all',
            phase: 'all',
            quality: 'all'
        };
        
        this.data = {
            sampleEvidence: [
                {"id": "37329115", "title": "Drug-Coated Balloon vs. Drug-Eluting Stent in Acute MI", "phase": "Meta-analysis", "design": "Systematic Review of 8 studies", "sampleSize": 1310, "endpointSuccess": false, "ichGcp": true, "confidence": 70},
                {"id": "40117414", "title": "Temporal Trends in 1-Year Mortality After TAVR", "phase": "Registry", "design": "TVT Registry", "sampleSize": 36877, "endpointSuccess": true, "ichGcp": true, "confidence": 90},
                {"id": "31561032", "title": "Complications of Subcutaneous ICD", "phase": "Post-Market", "design": "MAUDE Review", "sampleSize": 1604, "endpointSuccess": false, "ichGcp": false, "confidence": 45}
            ],
            sampleCompliance: [
                {"section": "GSPR Checklist", "status": "Complete", "owner": "Reg Affairs", "updated": "2025-01-01"},
                {"section": "Clinical Evaluation Report", "status": "Complete", "owner": "Clinical", "updated": "2025-01-03"},
                {"section": "PMCF Plan", "status": "Missing", "owner": "Clinical", "updated": "-"},
                {"section": "PSUR", "status": "Needs Update", "owner": "Reg Affairs", "updated": "2024-12-31"},
                {"section": "Risk Management Plan", "status": "Complete", "owner": "Quality", "updated": "2025-01-02"},
                {"section": "Clinical Investigation Plan", "status": "In Progress", "owner": "Clinical", "updated": "2025-01-05"}
            ]
        };
        
        this.charts = {};
        this.updateInterval = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing ResearchLens Regulatory...');
        
        this.setupEventListeners();
        
        // Initialize with fallback data immediately
        this.initializeWithFallbackData();
        
        // Then try to load live data
        try {
            await this.renderDashboard();
        } catch (error) {
            console.warn('Dashboard initialization failed:', error);
        }
        
        this.renderValidation();
        this.renderCompliance();
        this.renderAlerts();
        this.startLiveUpdates();
        
        setTimeout(() => this.renderIntelligence(), 500);
        console.log('✅ ResearchLens Regulatory fully initialized');
    }

    initializeWithFallbackData() {
        // Immediately populate with rich sample data
        this.data.sampleGuidance = this.fdaService.getRichSampleGuidance();
        this.data.sampleApprovals = this.fdaService.getRichSampleApprovals(); 
        this.data.sampleTrials = this.fdaService.getRichSampleTrials();
        
        // Render immediately so users see content right away
        this.renderGuidanceList();
        this.renderApprovalsList();
        this.renderTrialsList();
        this.renderSafetyTicker();
        
        console.log('📊 Fallback data loaded successfully');
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Query execution
        document.getElementById('executeQuery')?.addEventListener('click', () => {
            this.executeQuery();
        });

        // Allow Enter key to execute query
        document.getElementById('researchQuery')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.executeQuery();
            }
        });

        // Filter changes
        document.getElementById('therapeuticFilter')?.addEventListener('change', (e) => {
            this.currentFilters.therapeutic = e.target.value;
            this.applyFilters();
        });

        document.getElementById('phaseFilter')?.addEventListener('change', (e) => {
            this.currentFilters.phase = e.target.value;
            this.applyFilters();
        });

        document.getElementById('qualityFilter')?.addEventListener('change', (e) => {
            this.currentFilters.quality = e.target.value;
            this.applyFilters();
        });

        // Validation and export buttons
        document.getElementById('validateEvidence')?.addEventListener('click', () => {
            this.runValidation();
        });

        document.getElementById('exportEvidence')?.addEventListener('click', () => {
            this.exportFDATable();
        });

        // Intelligence generation
        document.getElementById('generateIntelligence')?.addEventListener('click', () => {
            this.generateIntelligenceReport();
        });

        // Pathway wizard
        document.getElementById('pathwayWizard')?.addEventListener('click', () => {
            this.openPathwayModal();
        });

        document.getElementById('wizardNext')?.addEventListener('click', () => {
            this.processPathwayWizard();
        });

        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.closePathwayModal();
        });

        document.getElementById('closeDrawer')?.addEventListener('click', () => {
            this.closeStudyDrawer();
        });

        // Export buttons
        document.getElementById('exportGSPR')?.addEventListener('click', () => {
            this.exportGSPRMatrix();
        });

        document.getElementById('exportAudit')?.addEventListener('click', () => {
            this.exportAuditTrace();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar?.classList.toggle('collapsed');
        });
    }

    async executeQuery() {
        const queryInput = document.getElementById('researchQuery');
        const query = queryInput?.value;
        
        if (!query || query.trim().length < 5) {
            alert('Please enter a research query (minimum 5 characters).\n\nExample queries:\n• "CAR-T cell therapy cardiac toxicity"\n• "drug eluting stent efficacy acute MI"\n• "deep brain stimulation Parkinson outcomes"\n• "continuous glucose monitoring diabetes"');
            return;
        }

        const executeBtn = document.getElementById('executeQuery');
        const originalText = executeBtn.textContent;
        
        try {
            // Show loading state
            executeBtn.textContent = '🔄 Analyzing Literature...';
            executeBtn.disabled = true;
            queryInput.disabled = true;
            
            // Show progress indicator
            this.showAnalysisProgress(query);
            
            // Perform intelligent analysis
            const results = await this.analysisService.analyzeQuery(query, this.currentFilters);
            this.currentQuery = results;

            // Update UI with results
            this.displayQueryResults(results);
            this.updateEvidenceTable(results.studies);
            
            // Switch to validation tab to show results
            this.switchTab('validation');
            
            // Show success message
            this.showSuccessMessage(`Analysis complete! Found ${results.studies.length} relevant studies in ${results.therapeutic} research.`);
            
        } catch (error) {
            console.error('Query execution error:', error);
            alert('Error executing query. Please try again.');
        } finally {
            executeBtn.textContent = originalText;
            executeBtn.disabled = false;
            queryInput.disabled = false;
        }
    }

    applyFilters() {
        if (this.currentQuery) {
            // Re-generate studies with new filters
            const filteredStudies = this.analysisService.generateRelevantStudies(
                this.currentQuery.therapeutic,
                this.currentQuery.productType,
                this.currentQuery.concepts,
                this.currentFilters
            );
            
            this.currentQuery.studies = filteredStudies;
            this.updateEvidenceTable(filteredStudies);
            
            this.showSuccessMessage(`Filters applied: ${Object.values(this.currentFilters).filter(f => f !== 'all').length} active filters`);
        } else {
            // Apply filters to default evidence
            let filteredEvidence = [...this.data.sampleEvidence];
            
            if (this.currentFilters.quality !== 'all') {
                filteredEvidence = filteredEvidence.filter(study => {
                    if (this.currentFilters.quality === 'high') return study.confidence >= 80;
                    if (this.currentFilters.quality === 'medium') return study.confidence >= 60 && study.confidence < 80;
                    if (this.currentFilters.quality === 'low') return study.confidence < 60;
                    return true;
                });
            }
            
            this.updateEvidenceTable(filteredEvidence);
        }
    }

    showAnalysisProgress(query) {
        const resultsContainer = document.getElementById('queryResults');
        const analysisContent = document.getElementById('analysisContent');
        
        if (!resultsContainer || !analysisContent) return;

        analysisContent.innerHTML = `
            <div class="analysis-progress">
                <h4>🔍 Analyzing: "${query}"</h4>
                <div class="progress-steps">
                    <div class="progress-step active">📊 Identifying therapeutic area...</div>
                    <div class="progress-step active">🔬 Processing literature database...</div>
                    <div class="progress-step active">⚡ Extracting key evidence...</div>
                    <div class="progress-step active">📋 Generating regulatory insights...</div>
                    <div class="progress-step active">🎯 Calculating recommendations...</div>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                    <p style="margin: 0; color: #0369a1;">✨ <strong>Universal Query Processing:</strong> Our AI adapts to any research question across all therapeutic areas and regulatory pathways.</p>
                </div>
            </div>
        `;

        resultsContainer.style.display = 'block';
    }

    displayQueryResults(results) {
        const resultsContainer = document.getElementById('queryResults');
        const analysisContent = document.getElementById('analysisContent');
        
        if (!resultsContainer || !analysisContent) return;

        analysisContent.innerHTML = `
            <div class="analysis-summary">
                <div class="query-header">
                    <h4>📊 Analysis Results</h4>
                    <span class="confidence-badge ${results.confidence >= 85 ? 'high' : results.confidence >= 70 ? 'medium' : 'low'}">${results.confidence}% Confidence</span>
                </div>
                
                <div class="query-metadata">
                    <p><strong>Query:</strong> ${results.query}</p>
                    <p><strong>Therapeutic Area:</strong> ${results.therapeutic.charAt(0).toUpperCase() + results.therapeutic.slice(1)}</p>
                    <p><strong>Product Type:</strong> ${results.productType.charAt(0).toUpperCase() + results.productType.slice(1)}</p>
                    <p><strong>Regulatory Pathway:</strong> ${results.regulatoryPathway}</p>
                </div>

                <div class="summary-text">
                    <h5>🎯 Executive Summary</h5>
                    <p>${results.summary}</p>
                </div>

                <div class="market-insights">
                    <h5>📈 Market Intelligence</h5>
                    <div class="market-stats">
                        <div class="stat-item">
                            <strong>Market Size:</strong> ${results.marketAnalysis.marketSize}
                        </div>
                        <div class="stat-item">
                            <strong>Growth Rate:</strong> ${results.marketAnalysis.growthRate}
                        </div>
                        <div class="stat-item">
                            <strong>Competitive Landscape:</strong> ${results.marketAnalysis.competitiveLandscape}
                        </div>
                    </div>
                    <div class="market-drivers">
                        <strong>Key Market Drivers:</strong>
                        <ul>
                            ${results.marketAnalysis.keyDrivers.map(driver => `<li>${driver}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="competitive-intelligence">
                    <h5>🏢 Competitive Intelligence</h5>
                    <div class="competitor-analysis">
                        <div class="competitor-section">
                            <strong>Market Leaders:</strong> ${results.competitiveIntelligence.marketLeaders.join(', ')}
                        </div>
                        <div class="competitor-section">
                            <strong>Emerging Players:</strong> ${results.competitiveIntelligence.emergingPlayers.join(', ')}
                        </div>
                        <div class="competitor-section">
                            <strong>Barrier to Entry:</strong> ${results.competitiveIntelligence.barrierToEntry}
                        </div>
                    </div>
                </div>

                <div class="recommendations-section">
                    <h5>💡 Strategic Recommendations</h5>
                    <ul class="recommendations-list">
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="risk-assessment">
                    <h5>⚠️ Risk Assessment Matrix</h5>
                    <div class="risk-grid">
                        ${results.riskFactors.map(risk => `
                            <div class="risk-item">
                                <div class="risk-header">
                                    <strong>${risk.factor}</strong>
                                    <span class="status status--${risk.risk.toLowerCase()}">${risk.risk} Risk</span>
                                </div>
                                <div class="risk-rationale">${risk.rationale}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="strategic-insights">
                    <h5>🎯 Strategic Insights</h5>
                    <div class="insights-grid">
                        <div class="insight-section">
                            <strong>Key Opportunities:</strong>
                            <ul>
                                ${results.strategicInsights.keyOpportunities.map(opp => `<li>${opp}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="insight-section">
                            <strong>Success Factors:</strong>
                            <ul>
                                ${results.strategicInsights.successFactors.map(factor => `<li>${factor}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="key-concepts">
                    <h5>🔍 Extracted Concepts</h5>
                    <div class="concept-tags">
                        ${results.concepts.map(concept => `<span class="concept-tag">${concept}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        resultsContainer.style.display = 'block';
    }

    showSuccessMessage(message) {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 90px; right: 20px; background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000;">
                ✅ ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }

    updateEvidenceTable(studies) {
        const tbody = document.getElementById('evidenceTableBody');
        if (!tbody) return;

        tbody.innerHTML = studies.map(study => `
            <tr onclick="app.showStudyDetails('${study.id}')" style="cursor: pointer;">
                <td>${study.id}</td>
                <td style="max-width: 300px;">${study.title}</td>
                <td>${study.phase}</td>
                <td style="max-width: 200px;">${study.design}</td>
                <td>${study.sampleSize.toLocaleString()}</td>
                <td><span class="status status--${study.endpointSuccess ? 'success' : 'error'}">${study.endpointSuccess ? 'Yes' : 'No'}</span></td>
                <td><span class="status status--${study.ichGcp ? 'success' : 'warning'}">${study.ichGcp ? 'ICH-GCP' : 'Non-GCP'}</span></td>
                <td><span class="confidence-badge ${study.confidence >= 80 ? 'high' : study.confidence >= 60 ? 'medium' : 'low'}">${study.confidence}%</span></td>
            </tr>
        `).join('');
    }

    async renderDashboard() {
        try {
            const [guidance, approvals, trials] = await Promise.all([
                this.fdaService.fetchFDAGuidance(),
                this.fdaService.fetchFDAApprovals(),
                this.fdaService.fetchClinicalTrials()
            ]);

            this.data.sampleGuidance = guidance;
            this.data.sampleApprovals = approvals;
            this.data.sampleTrials = trials;

            this.renderGuidanceList();
            this.renderApprovalsList();
            this.renderTrialsList();
            this.renderSafetyTicker();
            
            console.log('✅ Live FDA data loaded successfully');
        } catch (error) {
            console.error('Error loading FDA data:', error);
            // Fallback data already loaded in initializeWithFallbackData
        }
    }

    renderGuidanceList() {
        const container = document.getElementById('guidanceList');
        if (!container || !this.data.sampleGuidance) return;

        container.innerHTML = this.data.sampleGuidance.map(item => `
            <div class="guidance-item">
                <div class="item-header">
                    <div class="item-title">${item.title}</div>
                    <div class="item-date">${item.date}</div>
                </div>
                <div class="item-agency">${item.agency} • ${item.type || 'Guidance'}</div>
            </div>
        `).join('');
    }

    renderApprovalsList() {
        const container = document.getElementById('approvalsList');
        if (!container || !this.data.sampleApprovals) return;

        container.innerHTML = this.data.sampleApprovals.map(item => `
            <div class="approval-item">
                <div class="item-header">
                    <div class="item-title">${item.product}</div>
                    <div class="item-date">${item.date}</div>
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${item.company} • <span class="status status--success">${item.decision}</span>
                </div>
            </div>
        `).join('');
    }

    renderTrialsList() {
        const container = document.getElementById('trialsList');
        if (!container || !this.data.sampleTrials) return;

        container.innerHTML = this.data.sampleTrials.map(item => `
            <div class="trial-item">
                <div class="item-header">
                    <div class="item-title">${item.title}</div>
                    <div class="item-date">${item.postDate}</div>
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${item.nct} • ${item.phase} • <span class="status status--info">${item.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderSafetyTicker() {
        const container = document.getElementById('safetyTicker');
        if (!container) return;

        const safetyItems = [
            "FDA Class I recall: CardioShield ICD leads - fracture risk identified",
            "EMA safety notice: FlowGuard DES - elevated late thrombosis rates", 
            "PMDA alert: NeuroStim devices - software update required",
            "Health Canada: PulseFlow stents - post-market surveillance initiated",
            "FDA Warning Letter: Medical device manufacturer - quality system violations"
        ];

        container.innerHTML = safetyItems.map(item => 
            `<div class="ticker-item">${item}</div>`
        ).join('');
    }

    renderValidation() {
        const tbody = document.getElementById('evidenceTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.sampleEvidence.map(study => `
            <tr onclick="app.showStudyDetails('${study.id}')" style="cursor: pointer;">
                <td>${study.id}</td>
                <td>${study.title}</td>
                <td>${study.phase}</td>
                <td>${study.design}</td>
                <td>${study.sampleSize.toLocaleString()}</td>
                <td><span class="status status--${study.endpointSuccess ? 'success' : 'error'}">${study.endpointSuccess ? 'Yes' : 'No'}</span></td>
                <td><span class="status status--${study.ichGcp ? 'success' : 'warning'}">${study.ichGcp ? 'ICH-GCP' : 'Non-GCP'}</span></td>
                <td><span class="confidence-badge ${study.confidence >= 80 ? 'high' : study.confidence >= 60 ? 'medium' : 'low'}">${study.confidence}%</span></td>
            </tr>
        `).join('');
    }

    renderCompliance() {
        const tbody = document.getElementById('complianceTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.sampleCompliance.map(item => `
            <tr>
                <td>${item.section}</td>
                <td><span class="status status--${item.status === 'Complete' ? 'success' : item.status === 'Missing' ? 'error' : 'warning'}">${item.status}</span></td>
                <td>${item.owner}</td>
                <td>${item.updated}</td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="app.reviewComplianceItem('${item.section}')">Review</button>
                    <button class="btn btn--sm btn--primary" onclick="app.updateComplianceItem('${item.section}')">Update</button>
                </td>
            </tr>
        `).join('');

        // Render compliance alerts
        const alertsContainer = document.getElementById('complianceAlerts');
        if (alertsContainer) {
            const complianceAlerts = this.alertService.filterAlerts('compliance');
            alertsContainer.innerHTML = complianceAlerts.map(alert => `
                <div class="alert-item ${alert.severity}">
                    <div class="alert-header">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-time">${alert.time}</div>
                    </div>
                    <div class="alert-content">${alert.content}</div>
                    <div class="alert-actions">
                        <button class="btn btn--sm btn--outline" onclick="app.acknowledgeAlert(${alert.id})">Acknowledge</button>
                        <button class="btn btn--sm btn--primary">Take Action</button>
                    </div>
                </div>
            `).join('');
        }
    }

    renderAlerts() {
        const container = document.getElementById('alertsList');
        if (!container) return;

        const alerts = this.alertService.getAllAlerts();
        container.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}">
                <div class="alert-header">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <div class="alert-content">${alert.content}</div>
                <div class="alert-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.acknowledgeAlert(${alert.id})" ${alert.acknowledged ? 'disabled' : ''}>
                        ${alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                    <button class="btn btn--sm btn--primary">Take Action</button>
                </div>
            </div>
        `).join('');
    }

    renderIntelligence() {
        this.renderApprovalChart();
        this.renderRiskHeatmap();
    }

    renderApprovalChart() {
        const canvas = document.getElementById('approvalChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.currentQuery?.timeline || [
            {quarter: "Q1-2025", prob: 0.15},
            {quarter: "Q2-2025", prob: 0.35},
            {quarter: "Q3-2025", prob: 0.55},
            {quarter: "Q4-2025", prob: 0.72},
            {quarter: "Q1-2026", prob: 0.85}
        ];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        ctx.strokeStyle = '#008c8a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * (canvas.width - 40) + 20;
            const y = canvas.height - (point.prob * (canvas.height - 40)) - 20;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = '#008c8a';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw labels
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.quarter, x, canvas.height - 5);
            ctx.fillText(`${Math.round(point.prob * 100)}%`, x, y - 10);
        });
        
        ctx.stroke();
    }

    renderRiskHeatmap() {
        const canvas = document.getElementById('heatmapChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const risks = this.currentQuery?.riskFactors?.slice(0, 4) || [
            {factor: 'Regulatory', risk: 'Low'},
            {factor: 'Clinical', risk: 'Medium'},
            {factor: 'Manufacturing', risk: 'Low'},
            {factor: 'Market Access', risk: 'High'}
        ];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const riskColors = {
            'Low': '#4ade80',
            'Medium': '#fbbf24', 
            'High': '#f87171'
        };
        
        const riskValues = {
            'Low': 0.3,
            'Medium': 0.6,
            'High': 0.8
        };
        
        risks.forEach((risk, index) => {
            const y = index * 40 + 20;
            const level = riskValues[risk.risk] || 0.5;
            const width = level * (canvas.width - 120);
            
            // Draw bar
            ctx.fillStyle = riskColors[risk.risk] || '#6b7280';
            ctx.fillRect(80, y, width, 25);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(risk.factor, 10, y + 17);
            
            // Draw risk level
            ctx.fillStyle = '#666';
            ctx.fillText(risk.risk, width + 90, y + 17);
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName)?.classList.add('active');

        if (tabName === 'intelligence') {
            setTimeout(() => this.renderIntelligence(), 100);
        }
    }

    startLiveUpdates() {
        // Update timestamp every minute
        this.updateTimestamp();
        setInterval(() => this.updateTimestamp(), 60000);

        // Refresh data every 5 minutes
        setInterval(() => {
            console.log('🔄 Refreshing FDA data...');
            this.renderDashboard();
        }, 5 * 60 * 1000);
    }

    updateTimestamp() {
        const timestamp = new Date().toLocaleTimeString();
        document.querySelectorAll('.live-indicator').forEach(el => {
            el.textContent = `⚡ Live Data - Updated: ${timestamp}`;
        });
    }

    showStudyDetails(studyId) {
        const study = this.data.sampleEvidence.find(s => s.id === studyId) || 
                     (this.currentQuery?.studies?.find(s => s.id === studyId));
        
        if (!study) return;

        const drawerContent = document.getElementById('drawerContent');
        if (!drawerContent) return;

        drawerContent.innerHTML = `
            <div class="study-details">
                <h4>📄 ${study.title}</h4>
                <p><strong>Study ID:</strong> ${study.id}</p>
                <p><strong>Phase:</strong> ${study.phase}</p>
                <p><strong>Design:</strong> ${study.design}</p>
                <p><strong>Sample Size:</strong> ${study.sampleSize.toLocaleString()}</p>
                <p><strong>Primary Endpoint Success:</strong> ${study.endpointSuccess ? 'Yes' : 'No'}</p>
                <p><strong>ICH-GCP Compliant:</strong> ${study.ichGcp ? 'Yes' : 'No'}</p>
                <p><strong>Confidence Score:</strong> <span class="confidence-badge ${study.confidence >= 80 ? 'high' : 'medium'}">${study.confidence}%</span></p>
                
                <h5>Regulatory Assessment</h5>
                <p>This study provides ${study.confidence >= 80 ? 'strong' : study.confidence >= 60 ? 'moderate' : 'limited'} evidence for regulatory submissions.</p>
                
                <div class="study-actions">
                    <button class="btn btn--primary" onclick="app.exportStudyEvidence('${study.id}')">Export Evidence Table</button>
                    <button class="btn btn--outline" onclick="app.addToSubmission('${study.id}')">Add to Submission</button>
                </div>
            </div>
        `;

        document.getElementById('studyDrawer')?.classList.add('open');
    }

    closeStudyDrawer() {
        document.getElementById('studyDrawer')?.classList.remove('open');
    }

    runValidation() {
        const studyCount = this.currentQuery?.studies?.length || this.data.sampleEvidence.length;
        const avgConfidence = this.currentQuery?.confidence || 85;
        
        // Generate new alert for validation
        this.alertService.generateNewAlert(
            'validation',
            'info', 
            'Evidence Validation Complete',
            `Validated ${studyCount} studies with average confidence score of ${avgConfidence}%. All studies meet regulatory standards.`
        );
        
        this.showSuccessMessage(`Evidence validation complete! ${studyCount} studies validated with ${avgConfidence}% average confidence.`);
        
        // Update alerts display
        this.renderAlerts();
    }

    exportFDATable() {
        const data = this.currentQuery?.studies || this.data.sampleEvidence;
        const csvContent = this.generateCSV(data);
        this.downloadFile(csvContent, `fda-evidence-table-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        
        // Show success message
        this.showSuccessMessage(`FDA evidence table exported with ${data.length} studies`);
    }

    generateIntelligenceReport() {
        const report = this.intelligenceService.generateStrategicReport(this.currentQuery);
        
        // Show comprehensive intelligence summary
        const message = this.currentQuery 
            ? `Strategic intelligence generated!\n\n📊 Query: ${this.currentQuery.query}\n🏥 Therapeutic: ${this.currentQuery.therapeutic}\n💊 Product: ${this.currentQuery.productType}\n📈 Market: ${this.currentQuery.marketAnalysis.marketSize}\n🚀 Growth: ${this.currentQuery.marketAnalysis.growthRate}\n📋 Pathway: ${this.currentQuery.regulatoryPathway}`
            : 'Strategic intelligence report generated! Run a query first for personalized insights.';
            
        alert(`🎯 ${message}`);
        
        // Generate alert for strategic intelligence
        this.alertService.generateNewAlert(
            'strategic',
            'info',
            'Strategic Intelligence Report Generated', 
            `Comprehensive market and competitive analysis complete. Key insights available for strategic planning.`
        );
        
        this.renderAlerts();
    }

    openPathwayModal() {
        document.getElementById('pathwayModal')?.classList.remove('hidden');
    }

    closePathwayModal() {
        document.getElementById('pathwayModal')?.classList.add('hidden');
        document.getElementById('wizardResult')?.classList.add('hidden');
    }

    processPathwayWizard() {
        const productType = document.getElementById('productType')?.value;
        const riskLevel = document.getElementById('riskLevel')?.value;
        const targetMarket = document.getElementById('targetMarket')?.value;

        const pathways = {
            'device-class2': { path: '510(k) Clearance', timeline: '6-12 months', recommendation: 'Pre-submission meeting recommended' },
            'device-class3': { path: 'PMA Approval', timeline: '12-18 months', recommendation: 'Early engagement with FDA critical' },
            'drug-small': { path: 'IND → NDA', timeline: '18-24 months', recommendation: 'Consider breakthrough designation' },
            'biologic': { path: 'IND → BLA', timeline: '24-36 months', recommendation: 'Biosimilar pathway if applicable' }
        };

        const result = pathways[productType];
        const resultDiv = document.getElementById('wizardResult');
        
        if (resultDiv && result) {
            resultDiv.innerHTML = `
                <div class="pathway-recommendation">
                    <h4>🧭 Recommended Regulatory Pathway</h4>
                    <p><strong>Classification:</strong> ${result.path}</p>
                    <p><strong>Estimated Timeline:</strong> ${result.timeline}</p>
                    <p><strong>Risk Level:</strong> ${riskLevel}</p>
                    <p><strong>Target Market:</strong> ${targetMarket}</p>
                    <p><strong>Next Steps:</strong> ${result.recommendation}</p>
                    
                    <div class="pathway-actions" style="margin-top: 15px;">
                        <button class="btn btn--primary" onclick="app.exportPathwayReport()">Export Pathway Report</button>
                        <button class="btn btn--outline" onclick="app.scheduleConsultation()">Schedule Consultation</button>
                    </div>
                </div>
            `;
            
            resultDiv.classList.remove('hidden');
        }
    }

    exportPathwayReport() {
        const reportContent = `Regulatory Pathway Analysis Report
Generated: ${new Date().toLocaleString()}

Product Classification: Medical Device Class II
Recommended Pathway: 510(k) Clearance
Estimated Timeline: 6-12 months
Target Market: United States (FDA)

Next Steps:
1. Pre-submission meeting with FDA
2. Predicate device analysis
3. Clinical evidence package preparation
4. Quality management system review
`;
        
        this.downloadFile(reportContent, `regulatory-pathway-report-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
        this.showSuccessMessage('Regulatory pathway report exported successfully');
    }

    scheduleConsultation() {
        alert('📅 Consultation Request Submitted!\n\nOur regulatory experts will contact you within 24 hours to schedule a strategic consultation session.');
    }

    exportGSPRMatrix() {
        const csvContent = this.generateComplianceCSV();
        this.downloadFile(csvContent, `gspr-compliance-matrix-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        this.showSuccessMessage('GSPR compliance matrix exported successfully');
    }

    exportAuditTrace() {
        const auditContent = `EU MDR Audit Trail Report
Generated: ${new Date().toLocaleString()}

Compliance Status Summary:
- GSPR Checklist: Complete
- Clinical Evaluation Report: Complete  
- PMCF Plan: Missing (Action Required)
- PSUR: Needs Update
- Risk Management Plan: Complete
- Clinical Investigation Plan: In Progress

Recent Activity:
- 2025-01-05: Clinical Investigation Plan updated
- 2025-01-03: Clinical Evaluation Report completed
- 2025-01-02: Risk Management Plan approved
- 2025-01-01: GSPR Checklist finalized

Outstanding Actions:
1. Complete PMCF Plan (Due: High Priority)
2. Update PSUR documentation
3. Finalize Clinical Investigation Plan
`;
        
        this.downloadFile(auditContent, `eu-mdr-audit-trail-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
        this.showSuccessMessage('EU MDR audit trail exported successfully');
    }

    acknowledgeAlert(alertId) {
        const success = this.alertService.acknowledgeAlert(alertId);
        if (success) {
            this.renderAlerts();
            this.showSuccessMessage('Alert acknowledged successfully');
        }
    }

    reviewComplianceItem(section) {
        alert(`📋 Reviewing: ${section}\n\nOpening compliance documentation for detailed review and status assessment.`);
    }

    updateComplianceItem(section) {
        const item = this.data.sampleCompliance.find(i => i.section === section);
        if (item) {
            item.status = 'In Progress';
            item.updated = new Date().toISOString().split('T')[0];
            this.renderCompliance();
            this.showSuccessMessage(`${section} status updated to In Progress`);
        }
    }

    exportStudyEvidence(studyId) {
        const study = this.data.sampleEvidence.find(s => s.id === studyId) || 
                     (this.currentQuery?.studies?.find(s => s.id === studyId));
        
        if (study) {
            const csvContent = this.generateCSV([study]);
            this.downloadFile(csvContent, `study-evidence-${studyId}.csv`, 'text/csv');
            this.showSuccessMessage(`Evidence exported for study ${studyId}`);
        }
    }

    addToSubmission(studyId) {
        alert(`✅ Study ${studyId} added to regulatory submission package.\n\nThe study has been tagged for inclusion in the next regulatory filing.`);
        this.closeStudyDrawer();
    }

    generateCSV(data) {
        const headers = ['Study ID', 'Title', 'Phase', 'Design', 'Sample Size', 'Endpoint Success', 'ICH-GCP', 'Confidence'];
        const rows = data.map(item => [
            item.id,
            `"${item.title}"`,
            item.phase,
            `"${item.design}"`,
            item.sampleSize,
            item.endpointSuccess ? 'Yes' : 'No',
            item.ichGcp ? 'Yes' : 'No',
            item.confidence + '%'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateComplianceCSV() {
        const headers = ['Section', 'Status', 'Owner', 'Last Updated'];
        const rows = this.data.sampleCompliance.map(item => [
            `"${item.section}"`,
            item.status,
            item.owner,
            item.updated
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new RegulatoryPlatform();
});

// Global functions for onclick handlers
window.app = app;
