const Report = require('../models/Report');

// Get stock status report
exports.getStockStatus = async (req, res) => {
  try {
    const stockStatus = await Report.getStockStatus();
    res.json(stockStatus);
  } catch (error) {
    console.error('Get stock status report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily stock out report
exports.getDailyStockOutReport = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const dailyReport = await Report.getDailyStockOutReport(date);
    res.json(dailyReport);
  } catch (error) {
    console.error('Get daily stock out report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
