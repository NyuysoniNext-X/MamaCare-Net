// server/routes/ai.js - AI Routes

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// Public routes (no auth required - for symptom checker)
router.post('/analyze', aiController.analyzeSymptoms);
router.get('/week-insight/:week', aiController.getWeekInsight);
router.post('/calculate-due-date', aiController.calculateDueDate);

// Protected routes (auth required)
router.post('/analyze-vitals', auth, aiController.analyzeVitals);
router.post('/chat', auth, aiController.chatWithAI);
router.get('/pregnancy-insights/:week', auth, aiController.getPregnancyInsights);

// Hospital/Nurse only routes
router.get('/risk-stats', auth, authorize('nurse', 'hospital', 'admin'), aiController.getRiskStats);
router.get('/all-insights', auth, authorize('admin', 'hospital'), aiController.getAllInsights);

module.exports = router;