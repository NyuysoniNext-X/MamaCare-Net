// client/js/admin-dashboard.js

let usersChart, activityChart;

// Load dashboard data
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadUsers();
    initCharts();
});

// Load statistics
function loadStats() {
    setTimeout(() => {
        document.getElementById('totalUsers').textContent = '1,247';
        document.getElementById('totalMothers').textContent = '892';
        document.getElementById('totalNurses').textContent = '245';
        document.getElementById('totalHospitals').textContent = '110';
    }, 1000);
}

// Initialize charts
function initCharts() {
    // Users chart
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    usersChart = new Chart(usersCtx, {
        type: 'pie',
        data: {
            labels: ['Mothers', 'Nurses', 'Hospitals', 'Admins'],
            datasets: [{
                data: [892, 245, 110, 5],
                backgroundColor: ['#e83e8c', '#2563eb', '#7c3aed', '#0f172a'],
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

    // Activity chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    activityChart = new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Active Users',
                data: [245, 278, 312, 289, 356, 198, 167],
                backgroundColor: '#0d9488',
                borderRadius: 8
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

// Load users table
function loadUsers() {
    const users = [
        { name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Mother', status: 'Active', joined: '2026-01-15' },
        { name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Mother', status: 'Active', joined: '2026-02-03' },
        { name: 'Nurse Johnson', email: 'n.johnson@cityhospital.com', role: 'Nurse', status: 'Active', joined: '2026-01-10' },
        { name: 'Nurse Williams', email: 'k.williams@cityhospital.com', role: 'Nurse', status: 'Active', joined: '2026-01-22' },
        { name: 'City General', email: 'admin@citygeneral.com', role: 'Hospital', status: 'Active', joined: '2026-01-05' },
        { name: 'St. Mary\'s', email: 'admin@stmarys.com', role: 'Hospital', status: 'Pending', joined: '2026-03-01' },
        { name: 'Admin User', email: 'admin@mamacare.com', role: 'Admin', status: 'Active', joined: '2026-01-01' }
    ];

    const tableBody = document.getElementById('usersTable');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span style="background:${
            user.role === 'Mother' ? '#fce4ec' :
                user.role === 'Nurse' ? '#dbeafe' :
                    user.role === 'Hospital' ? '#ede9fe' : '#f1f5f9'
        }; padding:3px 10px; border-radius:15px;">${user.role}</span></td>
            <td><span style="color:${user.status === 'Active' ? '#15803d' : '#d97706'};">${user.status}</span></td>
            <td>${user.joined}</td>
            <td>
                <button onclick="editUser('${user.email}')" style="background:#0d9488; color:white; border:none; padding:5px 10px; border-radius:5px; margin-right:5px; cursor:pointer;">Edit</button>
                <button onclick="deleteUser('${user.email}')" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit user
function editUser(email) {
    alert(`Edit user: ${email}`);
}

// Delete user
function deleteUser(email) {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
        alert(`User ${email} deleted.`);
    }
}