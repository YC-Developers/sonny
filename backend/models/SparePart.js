const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  unit_price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total price
sparePartSchema.virtual('total_price').get(function() {
  return this.quantity * this.unit_price;
});

// Update the updatedAt field on save
sparePartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SparePart = mongoose.model('SparePart', sparePartSchema);

module.exports = SparePart;
