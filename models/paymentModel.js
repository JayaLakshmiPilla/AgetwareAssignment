const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');
const Loan = require('./loanModel');

const Payment = sequelize.define('Payment', {
  payment_id: { type: DataTypes.STRING, primaryKey: true },
  amount: DataTypes.DECIMAL,
  payment_type: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'payment_date',
  updatedAt: false
});

Loan.hasMany(Payment, { foreignKey: 'loan_id' });
Payment.belongsTo(Loan, { foreignKey: 'loan_id' });

module.exports = Payment;
