// client/js/auth.js - Complete Authentication System

// Configuration
const CONFIG = {
    API_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : 'https://api.mamacare-network.com/api',

    DEMO: {
        mother: {
            email: 'mother@example.com',
            password: 'mother123',
            redirect: '../dashboard/mother/pregnancy-tracker.html',
            message: '🌸 Welcome back, Mama!'
        },
        nurse: {
            email: 'nurse@cityhospital.com',
            password: 'nurse123',
            employeeId: 'NURSE001',
            redirect: '../dashboard/nurse/nurse-dashboard.html',
            message: '👩‍⚕️ Welcome, Nurse!'
        },
        hospital: {
            email: 'hospital@citycare.com',
            password: 'hospital123',
            facilityId: 'HOSP001',
            redirect: '../dashboard/hospital/hospital-dashboard.html',
            message: '🏥 Welcome, Hospital Staff!'
        },
        admin: {
            username: 'admin',
            password: 'admin123',
            key: 'ADMIN-KEY-2026',
            redirect: '../dashboard/admin/admin-dashboard.html',
            message: '👨‍💼 Welcome, Admin!'
        }
    }
};

// Login function
function login(role) {
    // Get form values based on role
    let email, password, username, employeeId, facilityId, adminKey;

    switch(role) {
        case 'mother':
            email = document.getElementById('email')?.value;
            password = document.getElementById('password')?.value;
            break;
        case 'nurse':
            email = document.getElementById('email')?.value;
            password = document.getElementById('password')?.value;
            employeeId = document.getElementById('employeeId')?.value || document.getElementById('nurse-employee-id')?.value;
            break;
        case 'hospital':
            email = document.getElementById('email')?.value;
            password = document.getElementById('password')?.value;
            facilityId = document.getElementById('facilityId')?.value;
            break;
        case 'admin':
            username = document.getElementById('username')?.value;
            password = document.getElementById('password')?.value;
            adminKey = document.getElementById('adminKey')?.value;
            break;
    }

    // Validate required fields
    if (!validateFields(role, { email, password, username, employeeId, facilityId, adminKey })) {
        return;
    }

    // Show loading
    const loginBtn = document.querySelector('button[onclick*="login"]');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = '🌸 Logging in...';
    loginBtn.disabled = true;

    // Check credentials (demo mode)
    setTimeout(() => {
        let isValid = false;
        let redirectUrl = '';
        let userMessage = '';
        let userData = {};

        switch(role) {
            case 'mother':
                if (email === CONFIG.DEMO.mother.email && password === CONFIG.DEMO.mother.password) {
                    isValid = true;
                    redirectUrl = CONFIG.DEMO.mother.redirect;
                    userMessage = CONFIG.DEMO.mother.message;
                    userData = { name: 'Sarah', email, role: 'mother' };
                }
                break;

            case 'nurse':
                if (email === CONFIG.DEMO.nurse.email &&
                    password === CONFIG.DEMO.nurse.password &&
                    employeeId === CONFIG.DEMO.nurse.employeeId) {
                    isValid = true;
                    redirectUrl = CONFIG.DEMO.nurse.redirect;
                    userMessage = CONFIG.DEMO.nurse.message;
                    userData = { name: 'Nurse Johnson', email, role: 'nurse', employeeId };
                }
                break;

            case 'hospital':
                if (email === CONFIG.DEMO.hospital.email &&
                    password === CONFIG.DEMO.hospital.password &&
                    facilityId === CONFIG.DEMO.hospital.facilityId) {
                    isValid = true;
                    redirectUrl = CONFIG.DEMO.hospital.redirect;
                    userMessage = CONFIG.DEMO.hospital.message;
                    userData = { name: 'City General', email, role: 'hospital', facilityId };
                }
                break;

            case 'admin':
                if (username === CONFIG.DEMO.admin.username &&
                    password === CONFIG.DEMO.admin.password &&
                    adminKey === CONFIG.DEMO.admin.key) {
                    isValid = true;
                    redirectUrl = CONFIG.DEMO.admin.redirect;
                    userMessage = CONFIG.DEMO.admin.message;
                    userData = { name: 'Admin', username, role: 'admin' };
                }
                break;
        }

        if (isValid) {
            // Store user info
            localStorage.setItem('token', 'demo-token-' + role);
            localStorage.setItem('role', role);
            localStorage.setItem('username', userData.name);
            localStorage.setItem('userEmail', userData.email || userData.username);

            // Show success message
            alert(userMessage + ' You\'ll be redirected to your dashboard.');

            // Update logout button
            updateLogoutButton();

            // Redirect
            window.location.href = redirectUrl;
        } else {
            showError('Invalid credentials. Please check your details and try again.');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    }, 1500);
}

// Validate fields based on role
function validateFields(role, fields) {
    const { email, password, username, employeeId, facilityId, adminKey } = fields;

    switch(role) {
        case 'mother':
        case 'nurse':
        case 'hospital':
            if (!email || !email.includes('@') || !email.includes('.')) {
                showError('Please enter a valid email address.');
                return false;
            }
            if (!password || password.length < 6) {
                showError('Password must be at least 6 characters.');
                return false;
            }
            if (role === 'nurse' && !employeeId) {
                showError('Please enter your employee ID.');
                return false;
            }
            if (role === 'hospital' && !facilityId) {
                showError('Please enter your facility ID.');
                return false;
            }
            break;

        case 'admin':
            if (!username) {
                showError('Please enter your username.');
                return false;
            }
            if (!password) {
                showError('Please enter your password.');
                return false;
            }
            if (!adminKey) {
                showError('Please enter your admin security key.');
                return false;
            }
            break;
    }

    return true;
}

// Logout function
function logout() {
    if (confirm('🌸 Are you sure you want to log out? Your data will be waiting for you when you return.')) {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Hide logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }

        // Show goodbye message
        alert('👋 You\'ve been safely logged out. Take care and come back soon!');

        // Redirect to home
        window.location.href = '../index.html';
    }
}

// Check authentication on protected pages
function requireAuth(allowedRoles = []) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        // Get current page path to determine correct redirect
        const currentPath = window.location.pathname;
        let loginPage = '../authentication/mother-login.html';

        if (currentPath.includes('nurse')) {
            loginPage = '../authentication/nurse-login.html';
        } else if (currentPath.includes('hospital')) {
            loginPage = '../authentication/hospital-login.html';
        } else if (currentPath.includes('admin')) {
            loginPage = '../authentication/admin-login.html';
        }

        alert('🌸 Please log in first to access your dashboard.');
        window.location.href = loginPage;
        return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        alert('You don\'t have permission to access this page.');
        window.location.href = '../index.html';
        return false;
    }

    return true;
}

// Update logout button visibility
function updateLogoutButton() {
    const token = localStorage.getItem('token');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token && logoutBtn) {
        logoutBtn.style.display = 'inline-block';
    } else if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update logout button
    updateLogoutButton();

    // Add logout button to header if needed
    addLogoutButtonIfNeeded();

    // Check if we're on a protected page
    const currentPath = window.location.pathname;

    // Define protected pages and their allowed roles
    const protectedPages = [
        { path: 'dashboard/mother', roles: ['mother'] },
        { path: 'dashboard/nurse', roles: ['nurse'] },
        { path: 'dashboard/hospital', roles: ['hospital', 'nurse', 'admin'] },
        { path: 'dashboard/admin', roles: ['admin'] }
    ];

    for (const page of protectedPages) {
        if (currentPath.includes(page.path)) {
            requireAuth(page.roles);
            break;
        }
    }
});

// Add logout button to header dynamically
function addLogoutButtonIfNeeded() {
    const token = localStorage.getItem('token');
    const nav = document.querySelector('.mh-nav-links');

    if (token && nav && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.className = 'mh-logout-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;
        nav.appendChild(logoutBtn);
    }
}

// Make functions globally available
window.login = login;
window.logout = logout;