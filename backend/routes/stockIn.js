const express = require('express');
const router = express.Router();
const stockInController = require('../controllers/stockInController');
const auth = require('../middleware/auth');

// Get all stock in records
router.get('/', auth, stockInController.getAllStockIn);

// Get a stock in record by ID
router.get('/:id', auth, stockInController.getStockInById);

// Create a new stock in record
router.post('/', auth, stockInController.createStockIn);

module.exports = router;
