const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const sparePartRoutes = require('./routes/sparePart');
const stockInRoutes = require('./routes/stockIn');
const stockOutRoutes = require('./routes/stockOut');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use('/api/stock-in', stockInRoutes);
app.use('/api/stock-out', stockOutRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('SmartPark Stock Inventory Management System API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
