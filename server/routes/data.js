// server/routes/data.js - Data Routes

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// All data routes require authentication
router.use(auth);

// ========== PREGNANCY ROUTES ==========
router.get('/pregnancy/:userId', dataController.getPregnancyRecords);
router.post('/pregnancy', dataController.savePregnancyRecord);
router.delete('/pregnancy/:recordId', dataController.deletePregnancyRecord);

// ========== BABY ROUTES ==========
router.get('/baby/:userId', dataController.getBabyRecords);
router.post('/baby', dataController.saveBabyRecord);
router.delete('/baby/:recordId', dataController.deleteBabyRecord);

// ========== SYMPTOM ROUTES ==========
router.get('/symptoms/:userId', dataController.getSymptomRecords);
router.post('/symptoms', dataController.saveSymptomRecord);

// ========== USER ROUTES ==========
router.get('/user/:userId', dataController.getUserData);
router.put('/user/:userId', dataController.updateUserData);

// ========== ADMIN ONLY ROUTES ==========
router.get('/admin/users', authorize('admin'), async (req, res) => {
    try {
        const fileStorage = require('../utils/file-storage');
        const users = await fileStorage.read('users.json');
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json({ success: true, users: safeUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

module.exports = router;