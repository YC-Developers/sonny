const StockIn = require('../models/StockIn');
const SparePart = require('../models/SparePart');

// Get all stock in records
exports.getAllStockIn = async (req, res) => {
  try {
    const stockInRecords = await StockIn.find()
      .sort({ stock_in_date: -1 })
      .populate('spare_part_id', 'name category');

    // Format the response to match the expected structure
    const formattedRecords = stockInRecords.map(record => ({
      id: record._id,
      spare_part_id: record.spare_part_id._id,
      spare_part_name: record.spare_part_id.name,
      category: record.spare_part_id.category,
      stock_in_quantity: record.stock_in_quantity,
      stock_in_date: record.stock_in_date,
      createdAt: record.createdAt
    }));

    res.json(formattedRecords);
  } catch (error) {
    console.error('Get all stock in records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a stock in record by ID
exports.getStockInById = async (req, res) => {
  try {
    const stockInRecord = await StockIn.findById(req.params.id)
      .populate('spare_part_id', 'name category');

    if (!stockInRecord) {
      return res.status(404).json({ message: 'Stock in record not found' });
    }

    // Format the response to match the expected structure
    const formattedRecord = {
      id: stockInRecord._id,
      spare_part_id: stockInRecord.spare_part_id._id,
      spare_part_name: stockInRecord.spare_part_id.name,
      category: stockInRecord.spare_part_id.category,
      stock_in_quantity: stockInRecord.stock_in_quantity,
      stock_in_date: stockInRecord.stock_in_date,
      createdAt: stockInRecord.createdAt
    };

    res.json(formattedRecord);
  } catch (error) {
    console.error('Get stock in record by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new stock in record
exports.createStockIn = async (req, res) => {
  try {
    const { spare_part_id, stock_in_quantity, stock_in_date } = req.body;

    // Validate input
    if (!spare_part_id || !stock_in_quantity || !stock_in_date) {
      return res.status(400).json({ message: 'Spare part ID, quantity, and date are required' });
    }

    // Check if spare part exists
    const sparePart = await SparePart.findById(spare_part_id);
    if (!sparePart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    // Create stock in record
    const stockInRecord = await StockIn.create({
      spare_part_id,
      stock_in_quantity: parseInt(stock_in_quantity),
      stock_in_date: new Date(stock_in_date)
    });

    // Format the response to match the expected structure
    const formattedRecord = {
      id: stockInRecord._id,
      spare_part_id: stockInRecord.spare_part_id,
      spare_part_name: sparePart.name,
      category: sparePart.category,
      stock_in_quantity: stockInRecord.stock_in_quantity,
      stock_in_date: stockInRecord.stock_in_date,
      createdAt: stockInRecord.createdAt
    };

    res.status(201).json(formattedRecord);
  } catch (error) {
    console.error('Create stock in record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
