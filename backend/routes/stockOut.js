const express = require('express');
const router = express.Router();
const stockOutController = require('../controllers/stockOutController');
const auth = require('../middleware/auth');

// Get all stock out records
router.get('/', auth, stockOutController.getAllStockOut);

// Get stock out records by date
router.get('/date/:date', auth, stockOutController.getStockOutByDate);

// Get a stock out record by ID
router.get('/:id', auth, stockOutController.getStockOutById);

// Create a new stock out record
router.post('/', auth, stockOutController.createStockOut);

// Update a stock out record
router.put('/:id', auth, stockOutController.updateStockOut);

// Delete a stock out record
router.delete('/:id', auth, stockOutController.deleteStockOut);

module.exports = router;
