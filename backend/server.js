const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'KisanBazar API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found - ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌾 KisanBazar API server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
