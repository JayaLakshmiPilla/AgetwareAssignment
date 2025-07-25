const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');
const Customer = require('./customerModel');

const Loan = sequelize.define('Loan', {
  loan_id: { type: DataTypes.STRING, primaryKey: true },
  principal_amount: DataTypes.DECIMAL,
  interest_rate: DataTypes.DECIMAL,
  loan_period_years: DataTypes.INTEGER,
  total_amount: DataTypes.DECIMAL,
  monthly_emi: DataTypes.DECIMAL,
  status: { type: DataTypes.STRING, defaultValue: 'ACTIVE' }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Customer.hasMany(Loan, { foreignKey: 'customer_id' });
Loan.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = Loan;
