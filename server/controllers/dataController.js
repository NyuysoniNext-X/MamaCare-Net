// server/controllers/dataController.js - Data Management Controller

const fileStorage = require('../utils/file-storage');

// ========== PREGNANCY RECORDS ==========

// Get pregnancy records for a user
async function getPregnancyRecords(req, res) {
    try {
        const userId = parseInt(req.params.userId);

        // Verify user has access
        if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'nurse') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const records = await fileStorage.getUserRecords('pregnancy-records.json', userId);

        res.json({
            success: true,
            records: records.sort((a, b) => b.id - a.id)
        });

    } catch (error) {
        console.error('Error getting pregnancy records:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving records'
        });
    }
}

// Save pregnancy record
async function savePregnancyRecord(req, res) {
    try {
        const { week, bp, weight, notes, insight } = req.body;
        const userId = req.user.id;

        if (!week || !bp || !weight) {
            return res.status(400).json({
                success: false,
                message: 'Week, BP, and weight are required'
            });
        }

        const record = {
            id: Date.now(),
            userId,
            week: parseInt(week),
            bp,
            weight: parseFloat(weight),
            notes: notes || '',
            insight: insight || '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            createdAt: new Date().toISOString()
        };

        await fileStorage.append('pregnancy-records.json', record);

        res.status(201).json({
            success: true,
            message: 'Record saved successfully',
            record
        });

    } catch (error) {
        console.error('Error saving pregnancy record:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving record'
        });
    }
}

// Delete pregnancy record
async function deletePregnancyRecord(req, res) {
    try {
        const recordId = parseInt(req.params.recordId);
        const userId = req.user.id;

        const records = await fileStorage.read('pregnancy-records.json');
        const record = records.find(r => r.id === recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        // Check ownership
        if (record.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const deleted = await fileStorage.delete('pregnancy-records.json', recordId);

        if (deleted) {
            res.json({
                success: true,
                message: 'Record deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting record'
            });
        }

    } catch (error) {
        console.error('Error deleting pregnancy record:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting record'
        });
    }
}

// ========== BABY RECORDS ==========

// Get baby records for a user
async function getBabyRecords(req, res) {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'nurse') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const records = await fileStorage.getUserRecords('baby-records.json', userId);

        res.json({
            success: true,
            records: records.sort((a, b) => b.id - a.id)
        });

    } catch (error) {
        console.error('Error getting baby records:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving records'
        });
    }
}

// Save baby record
async function saveBabyRecord(req, res) {
    try {
        const { activity, notes, feedingType, duration, sleepDuration, diaperType, icon, title } = req.body;
        const userId = req.user.id;

        if (!activity) {
            return res.status(400).json({
                success: false,
                message: 'Activity type is required'
            });
        }

        const record = {
            id: Date.now(),
            userId,
            activity,
            notes: notes || '',
            feedingType,
            duration,
            sleepDuration,
            diaperType,
            icon,
            title,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            createdAt: new Date().toISOString()
        };

        await fileStorage.append('baby-records.json', record);

        res.status(201).json({
            success: true,
            message: 'Record saved successfully',
            record
        });

    } catch (error) {
        console.error('Error saving baby record:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving record'
        });
    }
}

// Delete baby record
async function deleteBabyRecord(req, res) {
    try {
        const recordId = parseInt(req.params.recordId);
        const userId = req.user.id;

        const records = await fileStorage.read('baby-records.json');
        const record = records.find(r => r.id === recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        if (record.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const deleted = await fileStorage.delete('baby-records.json', recordId);

        if (deleted) {
            res.json({
                success: true,
                message: 'Record deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting record'
            });
        }

    } catch (error) {
        console.error('Error deleting baby record:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting record'
        });
    }
}

// ========== SYMPTOM RECORDS ==========

// Get symptom records for a user
async function getSymptomRecords(req, res) {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'nurse') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const records = await fileStorage.getUserRecords('symptoms.json', userId);

        res.json({
            success: true,
            records: records.sort((a, b) => b.id - a.id)
        });

    } catch (error) {
        console.error('Error getting symptom records:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving records'
        });
    }
}

// Save symptom record
async function saveSymptomRecord(req, res) {
    try {
        const { answers, riskLevel, riskScore, message, recommendations } = req.body;
        const userId = req.user.id;

        const record = {
            id: Date.now(),
            userId,
            answers,
            riskLevel,
            riskScore,
            message,
            recommendations,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            createdAt: new Date().toISOString()
        };

        await fileStorage.append('symptoms.json', record);

        res.status(201).json({
            success: true,
            message: 'Analysis saved successfully',
            record
        });

    } catch (error) {
        console.error('Error saving symptom record:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving record'
        });
    }
}

// ========== USER DATA ==========

// Get user data
async function getUserData(req, res) {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const users = await fileStorage.read('users.json');
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { password, ...userData } = user;

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user data'
        });
    }
}

// Update user data
async function updateUserData(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const updates = req.body;

        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Don't allow updating sensitive fields
        delete updates.password;
        delete updates.id;
        delete updates.role;

        const users = await fileStorage.read('users.json');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
        await fileStorage.write('users.json', users);

        const { password, ...userData } = users[userIndex];

        res.json({
            success: true,
            message: 'User updated successfully',
            user: userData
        });

    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user data'
        });
    }
}

module.exports = {
    getPregnancyRecords,
    savePregnancyRecord,
    deletePregnancyRecord,
    getBabyRecords,
    saveBabyRecord,
    deleteBabyRecord,
    getSymptomRecords,
    saveSymptomRecord,
    getUserData,
    updateUserData
};