// server/controllers/authController.js - Authentication Controller

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileStorage = require('../utils/file-storage');

// Register new user
async function register(req, res) {
    try {
        const { name, email, password, role, employeeId, facilityId } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user exists
        const users = await fileStorage.read('users.json');
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        // Add role-specific fields
        if (role === 'nurse' && employeeId) {
            newUser.employeeId = employeeId;
        }
        if (role === 'hospital' && facilityId) {
            newUser.facilityId = facilityId;
        }

        // Save user
        users.push(newUser);
        await fileStorage.write('users.json', users);

        // Create token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const { password: _, ...userData } = newUser;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user'
        });
    }
}

// Login user
async function login(req, res) {
    try {
        const { email, password, role, employeeId, facilityId, username, adminKey } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Read users
        const users = await fileStorage.read('users.json');

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check role-specific fields
        if (user.role === 'nurse' && employeeId && user.employeeId !== employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }

        if (user.role === 'hospital' && facilityId && user.facilityId !== facilityId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid facility ID'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        await fileStorage.write('users.json', users);

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const { password: _, ...userData } = user;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
}

// Verify token
async function verifyToken(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get user from database
        const users = await fileStorage.read('users.json');
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const { password: _, ...userData } = user;

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}

// Change password
async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Get user
        const users = await fileStorage.read('users.json');
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await fileStorage.write('users.json', users);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password'
        });
    }
}

// Logout
function logout(req, res) {
    // In a real app, you might blacklist the token
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
}

module.exports = {
    register,
    login,
    verifyToken,
    changePassword,
    logout
};