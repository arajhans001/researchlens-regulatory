// ResearchLens Regulatory Sentinel - Main Application Logic

class RegulatoryPlatform {
    constructor() {
        this.data = {
            sampleGuidance: [
                {"agency": "FDA", "title": "Cybersecurity in Medical Devices: Quality System Considerations", "date": "2025-07-15"},
                {"agency": "EMA", "title": "Adaptive Pathways for Transformative Therapies", "date": "2025-07-10"},
                {"agency": "PMDA", "title": "Guidelines on SaMD Clinical Evaluation", "date": "2025-06-30"}
            ],
            sampleApprovals: [
                {"agency": "FDA", "product": "NovaFlex DES", "company": "CardioNova", "decision": "PMA Approved", "date": "2025-07-05"},
                {"agency": "EMA", "product": "VivaPulse TAVR Valve", "company": "PulseMed", "decision": "CE Mark Granted", "date": "2025-06-28"}
            ],
            sampleTrials: [
                {"nct": "NCT05987654", "title": "Safety of PulseFlow DES in Small Vessels", "phase": "Phase III", "status": "Results Posted", "postDate": "2025-07-12"},
                {"nct": "NCT05876231", "title": "Registry of TAVR in Low-Risk Elderly", "phase": "Registry", "status": "Recruiting", "postDate": "2025-07-11"}
            ],
            sampleSafety: [
                {"agency": "FDA", "product": "CardioShield ICD Lead", "issue": "Class I Recall – Fracture risk", "date": "2025-07-14"},
                {"agency": "EMA", "product": "FlowGuard DES", "issue": "Safety Notice – Elevated late thrombosis", "date": "2025-07-09"}
            ],
            sampleEvidence: [
                {"id": "37329115", "title": "Drug-Coated Balloon vs. Drug-Eluting Stent in Acute MI", "phase": "Meta-analysis", "design": "Systematic Review of 8 studies", "sampleSize": 1310, "endpointSuccess": false, "ichGcp": true, "confidence": 70},
                {"id": "40117414", "title": "Temporal Trends in 1-Year Mortality After TAVR", "phase": "Registry", "design": "TVT Registry", "sampleSize": 36877, "endpointSuccess": true, "ichGcp": true, "confidence": 90},
                {"id": "31561032", "title": "Complications of Subcutaneous ICD", "phase": "Post-Market", "design": "MAUDE Review", "sampleSize": 1604, "endpointSuccess": false, "ichGcp": false, "confidence": 45}
            ],
            sampleCompliance: [
                {"section": "GSPR Checklist", "status": "Complete", "owner": "Reg Affairs", "updated": "2025-07-01"},
                {"section": "Clinical Evaluation Report", "status": "Complete", "owner": "Clinical", "updated": "2025-07-03"},
                {"section": "PMCF Plan", "status": "Missing", "owner": "Clinical", "updated": "-"},
                {"section": "PSUR", "status": "Needs Update", "owner": "Reg Affairs", "updated": "2024-12-31"}
            ],
            sampleForecast: [
                {"quarter": "Q3-2025", "prob": 0.35},
                {"quarter": "Q4-2025", "prob": 0.48},
                {"quarter": "Q1-2026", "prob": 0.62},
                {"quarter": "Q2-2026", "prob": 0.72},
                {"quarter": "Q3-2026", "prob": 0.81},
                {"quarter": "Q4-2026", "prob": 0.88}
            ]
        };

        this.alerts = [
            {id: 1, type: 'safety', severity: 'high', title: 'New Safety Signal Detected', content: 'PMCF Plan overdue for PulseFlow DES - regulatory action required', time: '2 hours ago', acknowledged: false},
            {id: 2, type: 'guidance', severity: 'medium', title: 'FDA Guidance Update', content: 'New cybersecurity requirements may impact current submissions', time: '1 day ago', acknowledged: false},
            {id: 3, type: 'validation', severity: 'medium', title: 'Evidence Confidence Alert', content: 'Study 31561032 flagged with confidence score below threshold (45%)', time: '3 days ago', acknowledged: false}
        ];

        this.charts = {};
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderDashboard();
        this.renderValidation();
        this.renderCompliance();
        this.renderAlerts();
        // Delay intelligence rendering to ensure DOM is ready
        setTimeout(() => this.renderIntelligence(), 500);
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Study drawer
        const closeDrawer = document.getElementById('closeDrawer');
        closeDrawer?.addEventListener('click', () => {
            this.closeStudyDrawer();
        });

        // Modal controls
        const pathwayWizard = document.getElementById('pathwayWizard');
        const closeModal = document.getElementById('closeModal');
        const wizardNext = document.getElementById('wizardNext');

        pathwayWizard?.addEventListener('click', () => {
            this.openPathwayModal();
        });

        closeModal?.addEventListener('click', () => {
            this.closePathwayModal();
        });

        wizardNext?.addEventListener('click', () => {
            this.processPathwayWizard();
        });

        // Export buttons
        document.getElementById('exportGSPR')?.addEventListener('click', () => {
            this.exportGSPRMatrix();
        });

        document.getElementById('exportCFR')?.addEventListener('click', () => {
            this.exportCFRTable();
        });

        document.getElementById('exportAudit')?.addEventListener('click', () => {
            this.exportAuditTrace();
        });

        // Filter changes
        document.getElementById('therapeuticFilter')?.addEventListener('change', (e) => {
            this.applyFilters();
        });
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Refresh charts if intelligence tab
        if (tabName === 'intelligence') {
            setTimeout(() => this.renderIntelligence(), 100);
        }
    }

    renderDashboard() {
        this.renderGuidanceList();
        this.renderApprovalsList();
        this.renderTrialsList();
        this.renderSafetyTicker();
    }

    renderGuidanceList() {
        const container = document.getElementById('guidanceList');
        if (!container) return;

        container.innerHTML = this.data.sampleGuidance.map(item => `
            <div class="guidance-item">
                <div class="item-header">
                    <div class="item-title">${item.title}</div>
                    <div class="item-date">${item.date}</div>
                </div>
                <div class="item-agency">${item.agency}</div>
            </div>
        `).join('');
    }

    renderApprovalsList() {
        const container = document.getElementById('approvalsList');
        if (!container) return;

        container.innerHTML = this.data.sampleApprovals.map(item => `
            <div class="approval-item">
                <div class="item-header">
                    <div class="item-title">${item.product}</div>
                    <div class="item-date">${item.date}</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                    <span class="item-agency">${item.company}</span>
                    <span class="status status--success">${item.decision}</span>
                </div>
            </div>
        `).join('');
    }

    renderTrialsList() {
        const container = document.getElementById('trialsList');
        if (!container) return;

        container.innerHTML = this.data.sampleTrials.map(item => `
            <div class="trial-item">
                <div class="item-header">
                    <div class="item-title">${item.title}</div>
                    <div class="item-date">${item.postDate}</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                    <span class="item-agency">${item.nct}</span>
                    <span class="status ${item.status === 'Results Posted' ? 'status--success' : 'status--warning'}">${item.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderSafetyTicker() {
        const container = document.getElementById('safetyTicker');
        if (!container) return;

        const tickerItems = this.data.sampleSafety.map(item => 
            `<span class="ticker-item">${item.agency}: ${item.product} - ${item.issue} (${item.date})</span>`
        ).join('');

        container.innerHTML = tickerItems;
    }

    renderValidation() {
        const tbody = document.getElementById('evidenceTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.sampleEvidence.map(study => {
            const confidenceClass = study.confidence >= 80 ? 'high' : study.confidence >= 50 ? 'medium' : 'low';
            return `
                <tr style="cursor: pointer;" data-study-id="${study.id}">
                    <td>${study.id}</td>
                    <td>${study.title}</td>
                    <td>${study.phase}</td>
                    <td>${study.design}</td>
                    <td>${study.sampleSize.toLocaleString()}</td>
                    <td>
                        <span class="status ${study.endpointSuccess ? 'status--success' : 'status--error'}">
                            ${study.endpointSuccess ? 'Met' : 'Not Met'}
                        </span>
                    </td>
                    <td>
                        <span class="status ${study.ichGcp ? 'status--success' : 'status--warning'}">
                            ${study.ichGcp ? 'ICH-GCP' : 'Non-Compliant'}
                        </span>
                    </td>
                    <td>
                        <span class="confidence-badge ${confidenceClass}">
                            ${study.confidence}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        // Add click event listeners to table rows
        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', (e) => {
                const studyId = e.currentTarget.dataset.studyId;
                this.openStudyDrawer(studyId);
            });
        });
    }

    renderCompliance() {
        const tbody = document.getElementById('complianceTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.sampleCompliance.map((item, index) => {
            const statusClass = item.status === 'Complete' ? 'status--success' : 
                               item.status === 'Missing' ? 'status--error' : 'status--warning';
            return `
                <tr>
                    <td>${item.section}</td>
                    <td><span class="status ${statusClass}">${item.status}</span></td>
                    <td>${item.owner}</td>
                    <td>${item.updated}</td>
                    <td>
                        <button class="btn btn--sm btn--outline" onclick="regulatoryPlatform.editComplianceItem(${index})">
                            Edit
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderIntelligence() {
        this.renderForecastChart();
        this.renderRiskChart();
    }

    renderForecastChart() {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;

        if (this.charts.forecast) {
            this.charts.forecast.destroy();
        }

        this.charts.forecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.sampleForecast.map(d => d.quarter),
                datasets: [{
                    label: 'Approval Probability',
                    data: this.data.sampleForecast.map(d => d.prob * 100),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderRiskChart() {
        const ctx = document.getElementById('riskChart');
        if (!ctx) return;

        if (this.charts.risk) {
            this.charts.risk.destroy();
        }

        const riskData = [
            {category: 'Clinical', low: 2, medium: 3, high: 1},
            {category: 'Quality', low: 1, medium: 2, high: 3},
            {category: 'Pre-Clinical', low: 3, medium: 1, high: 2},
            {category: 'Labeling', low: 2, medium: 2, high: 1}
        ];

        this.charts.risk = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: riskData.map(d => d.category),
                datasets: [
                    {
                        label: 'Low Risk',
                        data: riskData.map(d => d.low),
                        backgroundColor: '#B4413C'
                    },
                    {
                        label: 'Medium Risk',
                        data: riskData.map(d => d.medium),
                        backgroundColor: '#FFC185'
                    },
                    {
                        label: 'High Risk',
                        data: riskData.map(d => d.high),
                        backgroundColor: '#1FB8CD'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderAlerts() {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = this.alerts.map(alert => `
            <div class="alert-item ${alert.severity}" id="alert-${alert.id}">
                <div class="alert-header">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <div class="alert-content">${alert.content}</div>
                <div class="alert-actions">
                    <button class="btn btn--sm btn--primary" onclick="regulatoryPlatform.acknowledgeAlert(${alert.id})">
                        Acknowledge
                    </button>
                    <button class="btn btn--sm btn--outline">View Details</button>
                </div>
            </div>
        `).join('');
    }

    openStudyDrawer(studyId) {
        const study = this.data.sampleEvidence.find(s => s.id === studyId);
        if (!study) return;

        const drawer = document.getElementById('studyDrawer');
        const content = document.getElementById('drawerContent');

        content.innerHTML = `
            <div class="study-detail">
                <h4>Study ${study.id}</h4>
                <p><strong>Title:</strong> ${study.title}</p>
                <p><strong>Phase:</strong> ${study.phase}</p>
                <p><strong>Design:</strong> ${study.design}</p>
                <p><strong>Sample Size:</strong> ${study.sampleSize.toLocaleString()}</p>
                <p><strong>Endpoint Success:</strong> ${study.endpointSuccess ? 'Yes' : 'No'}</p>
                <p><strong>ICH-GCP Compliant:</strong> ${study.ichGcp ? 'Yes' : 'No'}</p>
                <div class="confidence-section">
                    <h5>Confidence Analysis</h5>
                    <div class="confidence-badge ${study.confidence >= 80 ? 'high' : study.confidence >= 50 ? 'medium' : 'low'}">
                        ${study.confidence}% Confidence
                    </div>
                    <div class="confidence-factors">
                        <p><strong>Factors Contributing to Score:</strong></p>
                        <ul>
                            <li>Study Design: ${study.design}</li>
                            <li>Sample Size: ${study.sampleSize >= 1000 ? 'Adequate' : 'Limited'}</li>
                            <li>GCP Compliance: ${study.ichGcp ? 'Compliant' : 'Non-Compliant'}</li>
                            <li>Endpoint Achievement: ${study.endpointSuccess ? 'Successful' : 'Failed'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        drawer.classList.add('open');
    }

    closeStudyDrawer() {
        const drawer = document.getElementById('studyDrawer');
        drawer.classList.remove('open');
    }

    openPathwayModal() {
        const modal = document.getElementById('pathwayModal');
        modal.classList.remove('hidden');
    }

    closePathwayModal() {
        const modal = document.getElementById('pathwayModal');
        modal.classList.add('hidden');
        
        // Reset wizard
        document.getElementById('wizardStep1').style.display = 'block';
        document.getElementById('wizardResult').classList.add('hidden');
    }

    processPathwayWizard() {
        const deviceType = document.getElementById('deviceType').value;
        const riskLevel = document.getElementById('riskLevel').value;

        if (!deviceType || !riskLevel) {
            alert('Please select both device type and risk level');
            return;
        }

        let recommendation = '';
        let pathway = '';
        let timeline = '';

        if (riskLevel === 'high') {
            pathway = 'Class III - PMA Required';
            timeline = '18-24 months';
            recommendation = 'Pre-Market Approval (PMA) required due to high-risk classification. Recommend engaging with FDA for pre-submission meetings.';
        } else if (riskLevel === 'medium') {
            pathway = 'Class IIb/III - CE Mark with Notified Body';
            timeline = '12-18 months';
            recommendation = 'CE Mark certification required with Notified Body review. Consider 510(k) for US market if predicate exists.';
        } else {
            pathway = 'Class I/IIa - Self Declaration';
            timeline = '6-12 months';
            recommendation = 'Self-declaration possible for EU market. 510(k) likely required for US market.';
        }

        document.getElementById('wizardStep1').style.display = 'none';
        const resultDiv = document.getElementById('wizardResult');
        resultDiv.innerHTML = `
            <h4>Recommended Pathway</h4>
            <div class="pathway-result">
                <p><strong>Classification:</strong> ${pathway}</p>
                <p><strong>Estimated Timeline:</strong> ${timeline}</p>
                <p><strong>Recommendation:</strong> ${recommendation}</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn--primary" onclick="regulatoryPlatform.closePathwayModal()">
                        Close
                    </button>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    }

    acknowledgeAlert(alertId) {
        const alertElement = document.getElementById(`alert-${alertId}`);
        if (alertElement) {
            alertElement.style.opacity = '0.5';
            alertElement.querySelector('.alert-actions').innerHTML = '<span class="status status--success">Acknowledged</span>';
        }

        // Update alert in data
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
        }
    }

    editComplianceItem(index) {
        const item = this.data.sampleCompliance[index];
        const newStatus = prompt(`Update status for ${item.section}:`, item.status);
        
        if (newStatus && newStatus !== item.status) {
            item.status = newStatus;
            item.updated = new Date().toISOString().split('T')[0];
            this.renderCompliance();
            
            // Save to sessionStorage for demo
            sessionStorage.setItem('complianceData', JSON.stringify(this.data.sampleCompliance));
        }
    }

    exportGSPRMatrix() {
        try {
            const ws = XLSX.utils.json_to_sheet(this.data.sampleCompliance);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "GSPR Evidence Matrix");
            
            const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
            const blob = new Blob([wbout], {type: 'application/octet-stream'});
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'GSPR_Evidence_Matrix.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export functionality requires full browser support. File generation simulated.');
        }
    }

    exportCFRTable() {
        try {
            const tableHTML = `
                <table border="1" style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th>Section</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.sampleCompliance.map(item => `
                            <tr>
                                <td>${item.section}</td>
                                <td>${item.status}</td>
                                <td>${item.owner}</td>
                                <td>${item.updated}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Fallback for browser compatibility
            const blob = new Blob([tableHTML], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'FDA_21CFR_Evidence_Table.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export functionality requires full browser support. File generation simulated.');
        }
    }

    exportAuditTrace() {
        try {
            const auditData = {
                exportDate: new Date().toISOString(),
                user: "regulatory_user",
                evidenceCount: this.data.sampleEvidence.length,
                complianceItems: this.data.sampleCompliance.length,
                evidenceData: this.data.sampleEvidence,
                complianceData: this.data.sampleCompliance
            };

            const blob = new Blob([JSON.stringify(auditData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'regulatory_audit_trace.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export functionality requires full browser support. File generation simulated.');
        }
    }

    applyFilters() {
        const therapeuticFilter = document.getElementById('therapeuticFilter').value;
        
        if (therapeuticFilter === 'cardiovascular') {
            // Simulate filtering - add EMA guidance card
            const guidanceList = document.getElementById('guidanceList');
            const existingCardio = Array.from(guidanceList.children).find(item => 
                item.textContent.includes('Cardiovascular Device Clinical Data Requirements')
            );

            if (!existingCardio) {
                const newItem = document.createElement('div');
                newItem.className = 'guidance-item';
                newItem.style.backgroundColor = '#e8f5e8';
                newItem.innerHTML = `
                    <div class="item-header">
                        <div class="item-title">Cardiovascular Device Clinical Data Requirements</div>
                        <div class="item-date">2025-07-16</div>
                    </div>
                    <div class="item-agency">EMA</div>
                `;
                guidanceList.insertBefore(newItem, guidanceList.firstChild);
            }
        }
    }

    startAutoRefresh() {
        this.updateInterval = setInterval(() => {
            this.simulateNewData();
        }, 60000); // Update every 60 seconds
    }

    simulateNewData() {
        // Add random new guidance
        const newGuidances = [
            {"agency": "FDA", "title": "Real-World Evidence for Drug Development", "date": "2025-08-05"},
            {"agency": "EMA", "title": "Digital Health Technologies in Clinical Trials", "date": "2025-08-05"},
            {"agency": "PMDA", "title": "AI/ML in Medical Device Software", "date": "2025-08-05"}
        ];

        const randomGuidance = newGuidances[Math.floor(Math.random() * newGuidances.length)];
        this.data.sampleGuidance.unshift(randomGuidance);
        
        if (this.data.sampleGuidance.length > 5) {
            this.data.sampleGuidance.pop();
        }

        this.renderGuidanceList();

        // Trigger new alert occasionally
        if (Math.random() < 0.3) {
            const newAlert = {
                id: Date.now(),
                type: 'guidance',
                severity: 'medium',
                title: 'New Guidance Published',
                content: `${randomGuidance.agency} published: ${randomGuidance.title}`,
                time: 'Just now',
                acknowledged: false
            };
            this.alerts.unshift(newAlert);
            this.renderAlerts();
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize the platform when DOM is loaded
let regulatoryPlatform;

document.addEventListener('DOMContentLoaded', () => {
    regulatoryPlatform = new RegulatoryPlatform();
});

// Cleanup on beforeunload
window.addEventListener('beforeunload', () => {
    if (regulatoryPlatform) {
        regulatoryPlatform.destroy();
    }
});