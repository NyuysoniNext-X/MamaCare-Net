// client/authentication/signup.js

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;

    strengthBar.style.width = strength + '%';

    if (strength <= 25) {
        strengthBar.style.background = '#b91c1c';
        strengthText.textContent = 'Weak password';
    } else if (strength <= 50) {
        strengthBar.style.background = '#d97706';
        strengthText.textContent = 'Fair password';
    } else if (strength <= 75) {
        strengthBar.style.background = '#0d9488';
        strengthText.textContent = 'Good password';
    } else {
        strengthBar.style.background = '#15803d';
        strengthText.textContent = 'Strong password';
    }
}

function signup() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const terms = document.getElementById('terms').checked;

    // Validation
    if (!name || !email || !password || !role) {
        showError('Please fill in all fields.');
        return;
    }

    if (!terms) {
        showError('Please agree to the Terms of Service and Privacy Policy.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showError('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }

    // Show loading
    const btn = document.querySelector('.mh-btn-primary');
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store user info
        localStorage.setItem('token', 'demo-token-' + role);
        localStorage.setItem('role', role);
        localStorage.setItem('username', name);
        localStorage.setItem('userEmail', email);

        showSuccess('Account created successfully! Redirecting...');

        setTimeout(() => {
            // Redirect based on role
            switch(role) {
                case 'mother':
                    window.location.href = '../dashboard/mother/pregnancy-tracker.html';
                    break;
                case 'nurse':
                    window.location.href = '../dashboard/nurse/nurse-dashboard.html';
                    break;
                case 'hospital':
                    window.location.href = '../dashboard/hospital/hospital-dashboard.html';
                    break;
                case 'admin':
                    window.location.href = '../dashboard/admin/admin-dashboard.html';
                    break;
                default:
                    window.location.href = '../index.html';
            }
        }, 2000);
    }, 1500);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}