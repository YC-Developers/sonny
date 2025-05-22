const mongoose = require('mongoose');

const stockInSchema = new mongoose.Schema({
  spare_part_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SparePart',
    required: true
  },
  stock_in_quantity: {
    type: Number,
    required: true
  },
  stock_in_date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update spare part quantity after stock in
stockInSchema.post('save', async function() {
  try {
    const SparePart = mongoose.model('SparePart');
    await SparePart.findByIdAndUpdate(
      this.spare_part_id,
      { $inc: { quantity: this.stock_in_quantity } }
    );
  } catch (error) {
    console.error('Error updating spare part quantity:', error);
  }
});

const StockIn = mongoose.model('StockIn', stockInSchema);

module.exports = StockIn;
