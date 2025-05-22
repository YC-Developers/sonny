const StockOut = require('../models/StockOut');
const SparePart = require('../models/SparePart');

// Get all stock out records
exports.getAllStockOut = async (req, res) => {
  try {
    const stockOutRecords = await StockOut.find()
      .sort({ stock_out_date: -1 })
      .populate('spare_part_id', 'name category');

    // Format the response to match the expected structure
    const formattedRecords = stockOutRecords.map(record => ({
      id: record._id,
      spare_part_id: record.spare_part_id._id,
      spare_part_name: record.spare_part_id.name,
      category: record.spare_part_id.category,
      stock_out_quantity: record.stock_out_quantity,
      stock_out_unit_price: record.stock_out_unit_price,
      stock_out_total_price: record.stock_out_total_price,
      stock_out_date: record.stock_out_date,
      createdAt: record.createdAt
    }));

    res.json(formattedRecords);
  } catch (error) {
    console.error('Get all stock out records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a stock out record by ID
exports.getStockOutById = async (req, res) => {
  try {
    const stockOutRecord = await StockOut.findById(req.params.id)
      .populate('spare_part_id', 'name category');

    if (!stockOutRecord) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    // Format the response to match the expected structure
    const formattedRecord = {
      id: stockOutRecord._id,
      spare_part_id: stockOutRecord.spare_part_id._id,
      spare_part_name: stockOutRecord.spare_part_id.name,
      category: stockOutRecord.spare_part_id.category,
      stock_out_quantity: stockOutRecord.stock_out_quantity,
      stock_out_unit_price: stockOutRecord.stock_out_unit_price,
      stock_out_total_price: stockOutRecord.stock_out_total_price,
      stock_out_date: stockOutRecord.stock_out_date,
      createdAt: stockOutRecord.createdAt
    };

    res.json(formattedRecord);
  } catch (error) {
    console.error('Get stock out record by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new stock out record
exports.createStockOut = async (req, res) => {
  try {
    const { spare_part_id, stock_out_quantity, stock_out_unit_price, stock_out_date } = req.body;

    // Validate input
    if (!spare_part_id || !stock_out_quantity || !stock_out_unit_price || !stock_out_date) {
      return res.status(400).json({ message: 'Spare part ID, quantity, unit price, and date are required' });
    }

    // Check if spare part exists
    const sparePart = await SparePart.findById(spare_part_id);
    if (!sparePart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    // Create stock out record
    const stockOutRecord = await StockOut.create({
      spare_part_id,
      stock_out_quantity: parseInt(stock_out_quantity),
      stock_out_unit_price: parseFloat(stock_out_unit_price),
      stock_out_date: new Date(stock_out_date)
    });

    // Format the response to match the expected structure
    const formattedRecord = {
      id: stockOutRecord._id,
      spare_part_id: stockOutRecord.spare_part_id,
      spare_part_name: sparePart.name,
      category: sparePart.category,
      stock_out_quantity: stockOutRecord.stock_out_quantity,
      stock_out_unit_price: stockOutRecord.stock_out_unit_price,
      stock_out_total_price: stockOutRecord.stock_out_total_price,
      stock_out_date: stockOutRecord.stock_out_date,
      createdAt: stockOutRecord.createdAt
    };

    res.status(201).json(formattedRecord);
  } catch (error) {
    console.error('Create stock out record error:', error);
    if (error.message.includes('Not enough quantity in stock')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a stock out record
exports.updateStockOut = async (req, res) => {
  try {
    const { spare_part_id, stock_out_quantity, stock_out_unit_price, stock_out_date } = req.body;

    // Validate input
    if (!spare_part_id || !stock_out_quantity || !stock_out_unit_price || !stock_out_date) {
      return res.status(400).json({ message: 'Spare part ID, quantity, unit price, and date are required' });
    }

    // Find and update the stock out record
    const updatedStockOut = await StockOut.findByIdAndUpdate(
      req.params.id,
      {
        spare_part_id,
        stock_out_quantity: parseInt(stock_out_quantity),
        stock_out_unit_price: parseFloat(stock_out_unit_price),
        stock_out_date: new Date(stock_out_date)
      },
      { new: true, runValidators: true }
    ).populate('spare_part_id', 'name category');

    if (!updatedStockOut) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    // Format the response to match the expected structure
    const formattedRecord = {
      id: updatedStockOut._id,
      spare_part_id: updatedStockOut.spare_part_id._id,
      spare_part_name: updatedStockOut.spare_part_id.name,
      category: updatedStockOut.spare_part_id.category,
      stock_out_quantity: updatedStockOut.stock_out_quantity,
      stock_out_unit_price: updatedStockOut.stock_out_unit_price,
      stock_out_total_price: updatedStockOut.stock_out_total_price,
      stock_out_date: updatedStockOut.stock_out_date,
      createdAt: updatedStockOut.createdAt
    };

    res.json(formattedRecord);
  } catch (error) {
    console.error('Update stock out record error:', error);
    if (error.message.includes('Not enough quantity in stock')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a stock out record
exports.deleteStockOut = async (req, res) => {
  try {
    const deletedStockOut = await StockOut.findByIdAndDelete(req.params.id);

    if (!deletedStockOut) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    res.json({ message: 'Stock out record deleted successfully' });
  } catch (error) {
    console.error('Delete stock out record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock out records by date
exports.getStockOutByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Convert date string to Date object
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find stock out records for the given date
    const stockOutRecords = await StockOut.find({
      stock_out_date: { $gte: startDate, $lte: endDate }
    })
      .sort({ createdAt: -1 })
      .populate('spare_part_id', 'name category');

    // Format the response to match the expected structure
    const formattedRecords = stockOutRecords.map(record => ({
      id: record._id,
      spare_part_id: record.spare_part_id._id,
      spare_part_name: record.spare_part_id.name,
      category: record.spare_part_id.category,
      stock_out_quantity: record.stock_out_quantity,
      stock_out_unit_price: record.stock_out_unit_price,
      stock_out_total_price: record.stock_out_total_price,
      stock_out_date: record.stock_out_date,
      createdAt: record.createdAt
    }));

    res.json(formattedRecords);
  } catch (error) {
    console.error('Get stock out records by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
