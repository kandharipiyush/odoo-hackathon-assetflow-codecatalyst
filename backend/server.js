require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const allocationRoutes = require('./routes/allocations');
const transferRoutes = require('./routes/transfers');
const maintenanceRoutes = require('./routes/maintenance');
const auditRoutes = require('./routes/audits');
const bookingRoutes = require('./routes/bookings');
const orgRoutes = require('./routes/org');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/org', orgRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'ERP Asset Management server is running.'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
