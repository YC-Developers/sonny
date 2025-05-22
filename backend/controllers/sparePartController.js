const SparePart = require('../models/SparePart');

// Get all spare parts
exports.getAllSpareParts = async (req, res) => {
  try {
    const spareParts = await SparePart.find().sort({ name: 1 });
    res.json(spareParts);
  } catch (error) {
    console.error('Get all spare parts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a spare part by ID
exports.getSparePartById = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    res.json(sparePart);
  } catch (error) {
    console.error('Get spare part by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new spare part
exports.createSparePart = async (req, res) => {
  try {
    const { name, category, quantity, unit_price } = req.body;

    // Validate input
    if (!name || !category || !unit_price) {
      return res.status(400).json({ message: 'Name, category, and unit price are required' });
    }

    const sparePart = await SparePart.create({
      name,
      category,
      quantity: quantity || 0,
      unit_price
    });

    res.status(201).json(sparePart);
  } catch (error) {
    console.error('Create spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a spare part
exports.updateSparePart = async (req, res) => {
  try {
    const { name, category, unit_price } = req.body;

    // Validate input
    if (!name || !category || !unit_price) {
      return res.status(400).json({ message: 'Name, category, and unit price are required' });
    }

    // Check if spare part exists and update it
    const updatedSparePart = await SparePart.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        unit_price,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedSparePart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.json(updatedSparePart);
  } catch (error) {
    console.error('Update spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a spare part
exports.deleteSparePart = async (req, res) => {
  try {
    const deletedSparePart = await SparePart.findByIdAndDelete(req.params.id);

    if (!deletedSparePart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    console.error('Delete spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
