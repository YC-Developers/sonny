const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');
const auth = require('../middleware/auth');

// Get all spare parts
router.get('/', auth, sparePartController.getAllSpareParts);

// Get a spare part by ID
router.get('/:id', auth, sparePartController.getSparePartById);

// Create a new spare part
router.post('/', auth, sparePartController.createSparePart);

// Update a spare part
router.put('/:id', auth, sparePartController.updateSparePart);

// Delete a spare part
router.delete('/:id', auth, sparePartController.deleteSparePart);

module.exports = router;
