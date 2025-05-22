const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Get stock status report
router.get('/stock-status', auth, reportController.getStockStatus);

// Get daily stock out report
router.get('/daily-stock-out/:date', auth, reportController.getDailyStockOutReport);

module.exports = router;
