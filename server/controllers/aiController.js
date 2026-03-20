// server/controllers/aiController.js - AI Controller

const aiUtils = require('../utils/ai-utils');
const fileStorage = require('../utils/file-storage');

// Analyze symptoms
async function analyzeSymptoms(req, res) {
    try {
        const { answers, userId } = req.body;

        if (!answers) {
            return res.status(400).json({
                success: false,
                message: 'Symptoms answers are required'
            });
        }

        // Analyze using AI utils
        const analysis = aiUtils.analyzeSymptoms(answers);

        // Save analysis if user is logged in
        if (userId) {
            const record = {
                id: Date.now(),
                userId,
                ...analysis,
                createdAt: new Date().toISOString()
            };
            await fileStorage.append('symptoms.json', record);
        }

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing symptoms'
        });
    }
}

// Get pregnancy week insight
function getWeekInsight(req, res) {
    try {
        const { week } = req.params;

        if (!week) {
            return res.status(400).json({
                success: false,
                message: 'Week number is required'
            });
        }

        const insight = aiUtils.getWeekInsight(parseInt(week));

        res.json({
            success: true,
            week: parseInt(week),
            insight
        });

    } catch (error) {
        console.error('Week insight error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting week insight'
        });
    }
}

// Calculate due date
function calculateDueDate(req, res) {
    try {
        const { lmpDate } = req.body;

        if (!lmpDate) {
            return res.status(400).json({
                success: false,
                message: 'Last menstrual period date is required'
            });
        }

        const result = aiUtils.calculateDueDate(lmpDate);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Due date calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating due date'
        });
    }
}

// Analyze vital trends
async function analyzeVitals(req, res) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get user's pregnancy records
        const records = await fileStorage.getUserRecords('pregnancy-records.json', userId);

        if (records.length === 0) {
            return res.json({
                success: true,
                trends: {
                    hasData: false,
                    message: 'No pregnancy records found. Start tracking to see your trends!'
                }
            });
        }

        const trends = aiUtils.analyzeVitalsTrends(records);

        res.json({
            success: true,
            trends: {
                hasData: true,
                ...trends
            }
        });

    } catch (error) {
        console.error('Vital analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing vitals'
        });
    }
}

// Get risk statistics (for hospital/nurse dashboard)
async function getRiskStats(req, res) {
    try {
        const { timeframe = 'week' } = req.query;
        const stats = await aiUtils.getRiskStats(timeframe);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Risk stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting risk statistics'
        });
    }
}

// AI chat/assistant endpoint
async function chatWithAI(req, res) {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get response from AI utils
        const reply = aiUtils.getChatResponse(message, context);

        res.json({
            success: true,
            reply,
            context: {
                ...context,
                lastMessage: message,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing chat'
        });
    }
}

// Get pregnancy insights
async function getPregnancyInsights(req, res) {
    try {
        const { week } = req.params;
        const insight = aiUtils.getWeekInsight(parseInt(week));

        res.json({
            success: true,
            insight
        });

    } catch (error) {
        console.error('Pregnancy insights error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting insights'
        });
    }
}

// Get all insights for hospital dashboard
async function getAllInsights(req, res) {
    try {
        // Get all symptom records
        const symptoms = await fileStorage.read('symptoms.json');

        // Get all pregnancy records
        const pregnancies = await fileStorage.read('pregnancy-records.json');

        // Get all users
        const users = await fileStorage.read('users.json');

        const insights = {
            totalAssessments: symptoms.length,
            totalTrackers: pregnancies.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            riskDistribution: {
                high: symptoms.filter(s => s.riskLevel === 'HIGH').length,
                moderate: symptoms.filter(s => s.riskLevel === 'MODERATE').length,
                low: symptoms.filter(s => s.riskLevel === 'LOW').length
            },
            recentActivity: symptoms.slice(-10).reverse()
        };

        res.json({
            success: true,
            insights
        });

    } catch (error) {
        console.error('Error getting insights:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting insights'
        });
    }
}

module.exports = {
    analyzeSymptoms,
    getWeekInsight,
    calculateDueDate,
    analyzeVitals,
    getRiskStats,
    chatWithAI,
    getPregnancyInsights,
    getAllInsights
};