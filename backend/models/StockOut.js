const mongoose = require('mongoose');

const stockOutSchema = new mongoose.Schema({
  spare_part_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SparePart',
    required: true
  },
  stock_out_quantity: {
    type: Number,
    required: true
  },
  stock_out_unit_price: {
    type: Number,
    required: true
  },
  stock_out_date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total price
stockOutSchema.virtual('stock_out_total_price').get(function() {
  return this.stock_out_quantity * this.stock_out_unit_price;
});

// Middleware to check if there's enough quantity before saving
stockOutSchema.pre('save', async function(next) {
  try {
    const SparePart = mongoose.model('SparePart');
    const sparePart = await SparePart.findById(this.spare_part_id);

    if (!sparePart) {
      return next(new Error('Spare part not found'));
    }

    if (this.isNew) {
      // New stock out record
      if (sparePart.quantity < this.stock_out_quantity) {
        return next(new Error('Not enough quantity in stock'));
      }
    } else if (this.isModified('stock_out_quantity') || this.isModified('spare_part_id')) {
      // Get the original document
      const original = await this.constructor.findById(this._id);

      if (this.spare_part_id.toString() === original.spare_part_id.toString()) {
        // Same spare part, check if the new quantity is greater than the old one
        if (this.stock_out_quantity > original.stock_out_quantity) {
          const additionalQuantity = this.stock_out_quantity - original.stock_out_quantity;

          if (sparePart.quantity < additionalQuantity) {
            return next(new Error('Not enough quantity in stock for the update'));
          }
        }
      } else {
        // Different spare part
        if (sparePart.quantity < this.stock_out_quantity) {
          return next(new Error('Not enough quantity in stock for the update'));
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to update spare part quantity after stock out
stockOutSchema.post('save', async function() {
  try {
    const SparePart = mongoose.model('SparePart');
    await SparePart.findByIdAndUpdate(
      this.spare_part_id,
      { $inc: { quantity: -this.stock_out_quantity } }
    );
  } catch (error) {
    console.error('Error updating spare part quantity:', error);
  }
});

// Middleware to handle updates
stockOutSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    const doc = await this.model.findOne(this.getQuery());

    if (!doc) {
      return next(new Error('Stock out record not found'));
    }

    // If quantity or spare part ID is being updated
    if (update.stock_out_quantity || update.spare_part_id) {
      const SparePart = mongoose.model('SparePart');

      // If spare part ID is being changed
      if (update.spare_part_id && update.spare_part_id.toString() !== doc.spare_part_id.toString()) {
        // Check if there's enough quantity for the new spare part
        const newSparePart = await SparePart.findById(update.spare_part_id);

        if (!newSparePart) {
          return next(new Error('New spare part not found'));
        }

        if (newSparePart.quantity < (update.stock_out_quantity || doc.stock_out_quantity)) {
          return next(new Error('Not enough quantity in stock for the new spare part'));
        }

        // Add the quantity back to the old spare part
        await SparePart.findByIdAndUpdate(
          doc.spare_part_id,
          { $inc: { quantity: doc.stock_out_quantity } }
        );

        // Subtract the quantity from the new spare part
        await SparePart.findByIdAndUpdate(
          update.spare_part_id,
          { $inc: { quantity: -(update.stock_out_quantity || doc.stock_out_quantity) } }
        );
      }
      // If only quantity is being changed
      else if (update.stock_out_quantity && update.stock_out_quantity !== doc.stock_out_quantity) {
        const sparePart = await SparePart.findById(doc.spare_part_id);

        if (!sparePart) {
          return next(new Error('Spare part not found'));
        }

        const quantityDifference = update.stock_out_quantity - doc.stock_out_quantity;

        if (quantityDifference > 0 && sparePart.quantity < quantityDifference) {
          return next(new Error('Not enough quantity in stock for the update'));
        }

        // Update the spare part quantity
        await SparePart.findByIdAndUpdate(
          doc.spare_part_id,
          { $inc: { quantity: -quantityDifference } }
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to handle deletes
stockOutSchema.pre('findOneAndDelete', async function(next) {
  try {
    const doc = await this.model.findOne(this.getQuery());

    if (!doc) {
      return next();
    }

    // Add the quantity back to the spare part
    const SparePart = mongoose.model('SparePart');
    await SparePart.findByIdAndUpdate(
      doc.spare_part_id,
      { $inc: { quantity: doc.stock_out_quantity } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

const StockOut = mongoose.model('StockOut', stockOutSchema);

module.exports = StockOut;
