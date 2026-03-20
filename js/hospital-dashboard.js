// client/js/hospital-dashboard.js

let riskChart, trendsChart;

// Load dashboard data
document.addEventListener('DOMContentLoaded', function() {
    loadHospitalData();
    loadSymptoms();
    loadHighRiskPatients();
    initCharts();
});

// Load hospital stats
function loadHospitalData() {
    setTimeout(() => {
        document.getElementById('totalMothers').textContent = '156';
        document.getElementById('highRiskCount').textContent = '12';
        document.getElementById('moderateRiskCount').textContent = '34';
        document.getElementById('lowRiskCount').textContent = '110';
    }, 1000);
}

// Initialize charts
function initCharts() {
    // Risk distribution chart
    const riskCtx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(riskCtx, {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
            datasets: [{
                data: [110, 34, 12],
                backgroundColor: ['#15803d', '#d97706', '#b91c1c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Trends chart
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Assessments',
                data: [45, 52, 48, 61],
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Load symptoms table
function loadSymptoms() {
    const symptoms = [
        {
            date: '2026-03-19',
            patient: 'Sarah Johnson',
            symptoms: 'Mild headache, fatigue',
            risk: 'Low',
            riskColor: '#15803d'
        },
        {
            date: '2026-03-19',
            patient: 'Maria Garcia',
            symptoms: 'Swelling in hands, BP 135/88',
            risk: 'Moderate',
            riskColor: '#d97706'
        },
        {
            date: '2026-03-19',
            patient: 'Lisa Chen',
            symptoms: 'Severe headache, vision changes, BP 145/92',
            risk: 'High',
            riskColor: '#b91c1c'
        },
        {
            date: '2026-03-18',
            patient: 'Emily Brown',
            symptoms: 'Nausea, fatigue',
            risk: 'Low',
            riskColor: '#15803d'
        },
        {
            date: '2026-03-18',
            patient: 'Jessica Taylor',
            symptoms: 'Abdominal pain, BP 128/82',
            risk: 'Moderate',
            riskColor: '#d97706'
        }
    ];

    const tableBody = document.getElementById('symptomsTable');
    tableBody.innerHTML = '';

    symptoms.forEach(symptom => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symptom.date}</td>
            <td>${symptom.patient}</td>
            <td>${symptom.symptoms}</td>
            <td><span style="color:${symptom.riskColor}; font-weight:600;">${symptom.risk}</span></td>
            <td>
                <button onclick="viewPatient('${symptom.patient}')" style="background:#0d9488; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load high risk patients
function loadHighRiskPatients() {
    const highRisk = [
        {
            name: 'Lisa Chen',
            risk: 'High',
            details: 'BP 145/92, Vision changes, Severe headache',
            lastCheck: '2 hours ago'
        },
        {
            name: 'Rachel Kim',
            risk: 'High',
            details: 'BP 150/95, Swelling, Upper abdominal pain',
            lastCheck: '5 hours ago'
        },
        {
            name: 'Amanda White',
            risk: 'High',
            details: 'BP 142/90, Decreased fetal movement',
            lastCheck: '1 day ago'
        }
    ];

    const list = document.getElementById('highRiskList');
    list.innerHTML = '';

    highRisk.forEach(patient => {
        const patientEl = document.createElement('div');
        patientEl.className = 'mh-record-entry';
        patientEl.style.borderLeftColor = '#b91c1c';
        patientEl.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${patient.name}</strong>
                <span style="color:#b91c1c; font-weight:600;">${patient.risk} Risk</span>
            </div>
            <p style="margin:10px 0;">${patient.details}</p>
            <p style="font-size:0.9rem; color:var(--soft-gray);">Last check: ${patient.lastCheck}</p>
            <div style="margin-top:10px;">
                <button onclick="contactPatient('${patient.name}')" style="background:#0d9488; color:white; border:none; padding:8px 15px; border-radius:8px; margin-right:10px; cursor:pointer;">Contact</button>
                <button onclick="viewDetails('${patient.name}')" style="background:#475569; color:white; border:none; padding:8px 15px; border-radius:8px; cursor:pointer;">View Details</button>
            </div>
        `;
        list.appendChild(patientEl);
    });
}

// View patient
function viewPatient(patientName) {
    alert(`Viewing records for ${patientName}`);
}

// Contact patient
function contactPatient(patientName) {
    alert(`Contacting ${patientName}...`);
}

// View details
function viewDetails(patientName) {
    alert(`Viewing detailed records for ${patientName}`);
}