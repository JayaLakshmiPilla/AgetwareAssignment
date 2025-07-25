require('dotenv').config();
const express = require('express');
const app = express();

const { sequelize } = require('./db/database');
const loanRoutes = require('./routes/loanRoutes');
const customerRoutes = require('./routes/customerRoutes');

// Middleware
app.use(express.json());

// Route handlers
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/customers', customerRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Bank Lending API is live! Visit /api/v1/loans or /api/v1/customers to get started.');
});

// API base route info
app.get('/api/v1', (req, res) => {
  res.send('📘 API Base Route: Use /api/v1/loans or /api/v1/customers to interact with the system.');
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: '🚫 Route not found. Please check the URL or refer to the documentation.'
  });
});

// Server setup
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
