require('dotenv').config();
const express = require('express');
const app = express();

const { sequelize } = require('./db/database');
const loanRoutes = require('./routes/loanRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use(express.json());
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/customers', customerRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
