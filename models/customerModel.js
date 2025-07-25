const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Customer;
