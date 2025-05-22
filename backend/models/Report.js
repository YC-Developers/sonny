const mongoose = require('mongoose');

class Report {
  static async getStockStatus() {
    try {
      // Get models
      const SparePart = mongoose.model('SparePart');
      const StockIn = mongoose.model('StockIn');
      const StockOut = mongoose.model('StockOut');

      // Get all spare parts
      const spareParts = await SparePart.find().sort({ name: 1 });

      // Get all stock in records
      const stockInRecords = await StockIn.find();

      // Get all stock out records
      const stockOutRecords = await StockOut.find();

      // Calculate totals for each spare part
      const result = spareParts.map(sparePart => {
        const totalStockIn = stockInRecords
          .filter(record => record.spare_part_id.toString() === sparePart._id.toString())
          .reduce((sum, record) => sum + record.stock_in_quantity, 0);

        const totalStockOut = stockOutRecords
          .filter(record => record.spare_part_id.toString() === sparePart._id.toString())
          .reduce((sum, record) => sum + record.stock_out_quantity, 0);

        return {
          id: sparePart._id,
          name: sparePart.name,
          category: sparePart.category,
          current_quantity: sparePart.quantity,
          total_stock_in: totalStockIn,
          total_stock_out: totalStockOut
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getDailyStockOutReport(date) {
    try {
      // Get models
      const SparePart = mongoose.model('SparePart');
      const StockOut = mongoose.model('StockOut');

      // Convert date string to Date object
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Find stock out records for the given date
      const stockOutRecords = await StockOut.find({
        stock_out_date: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: -1 });

      // Get spare part details for each record
      const items = await Promise.all(stockOutRecords.map(async record => {
        const sparePart = await SparePart.findById(record.spare_part_id);

        return {
          id: record._id,
          stock_out_date: record.stock_out_date,
          spare_part_name: sparePart ? sparePart.name : 'Unknown',
          category: sparePart ? sparePart.category : 'Unknown',
          stock_out_quantity: record.stock_out_quantity,
          stock_out_unit_price: record.stock_out_unit_price,
          stock_out_total_price: record.stock_out_total_price
        };
      }));

      // Calculate total
      const total = items.reduce((acc, item) => acc + item.stock_out_total_price, 0);

      return {
        date,
        items,
        total
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Report;
