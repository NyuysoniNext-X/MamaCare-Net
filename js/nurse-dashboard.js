// client/js/nurse-dashboard.js

// Load dashboard data
document.addEventListener('DOMContentLoaded', function() {
    loadNurseData();
    loadPatients();
    loadAlerts();

    // Display nurse name
    const nurseName = localStorage.getItem('username') || 'Nurse';
    document.getElementById('nurseName').textContent = nurseName;
});

// Load nurse stats
function loadNurseData() {
    // Simulate loading data
    setTimeout(() => {
        document.getElementById('totalPatients').textContent = '24';
        document.getElementById('todayAssessments').textContent = '8';
        document.getElementById('highRiskPatients').textContent = '3';
    }, 1000);
}

// Load patients
function loadPatients() {
    const patients = [
        {
            name: 'Sarah Johnson',
            week: 32,
            bp: '118/76',
            weight: 68.5,
            lastCheck: '2026-03-19',
            risk: 'Low',
            riskColor: '#15803d'
        },
        {
            name: 'Maria Garcia',
            week: 28,
            bp: '135/88',
            weight: 72.3,
            lastCheck: '2026-03-19',
            risk: 'Moderate',
            riskColor: '#d97706'
        },
        {
            name: 'Lisa Chen',
            week: 35,
            bp: '145/92',
            weight: 75.1,
            lastCheck: '2026-03-18',
            risk: 'High',
            riskColor: '#b91c1c'
        },
        {
            name: 'Emily Brown',
            week: 24,
            bp: '110/70',
            weight: 62.4,
            lastCheck: '2026-03-18',
            risk: 'Low',
            riskColor: '#15803d'
        },
        {
            name: 'Jessica Taylor',
            week: 30,
            bp: '128/82',
            weight: 70.2,
            lastCheck: '2026-03-17',
            risk: 'Moderate',
            riskColor: '#d97706'
        }
    ];

    const tableBody = document.getElementById('patientsTable');
    tableBody.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>Week ${patient.week}</td>
            <td>${patient.bp}</td>
            <td>${patient.weight} kg</td>
            <td>${patient.lastCheck}</td>
            <td><span style="color:${patient.riskColor}; font-weight:600;">${patient.risk}</span></td>
            <td>
                <button onclick="viewPatient('${patient.name}')" style="background:#0d9488; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load alerts
function loadAlerts() {
    const alerts = [
        {
            patient: 'Lisa Chen',
            symptom: 'Severe headache, vision changes',
            time: '2 hours ago',
            risk: 'High'
        },
        {
            patient: 'Maria Garcia',
            symptom: 'Persistent swelling in hands',
            time: '5 hours ago',
            risk: 'Moderate'
        },
        {
            patient: 'Jessica Taylor',
            symptom: 'Upper abdominal pain',
            time: '1 day ago',
            risk: 'Moderate'
        }
    ];

    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';

    alerts.forEach(alert => {
        const alertEl = document.createElement('div');
        alertEl.className = 'mh-record-entry';
        alertEl.style.borderLeftColor = alert.risk === 'High' ? '#b91c1c' : '#d97706';
        alertEl.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${alert.patient}</strong>
                <span style="color:${alert.risk === 'High' ? '#b91c1c' : '#d97706'}; font-weight:600;">${alert.risk} Risk</span>
            </div>
            <p style="margin:10px 0;">${alert.symptom}</p>
            <p style="font-size:0.9rem; color:var(--soft-gray);">${alert.time}</p>
            <button onclick="contactPatient('${alert.patient}')" style="background:#0d9488; color:white; border:none; padding:8px 15px; border-radius:8px; margin-top:10px; cursor:pointer;">Contact Patient</button>
        `;
        alertsList.appendChild(alertEl);
    });
}

// View patient details
function viewPatient(patientName) {
    alert(`Viewing details for ${patientName}. This would open patient records.`);
}

// Contact patient
function contactPatient(patientName) {
    alert(`Contacting ${patientName}... This would open messaging interface.`);
}

// Refresh dashboard
function refreshDashboard() {
    loadPatients();
    loadAlerts();
}