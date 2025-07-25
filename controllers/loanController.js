const { v4: uuidv4 } = require('uuid');
const Loan = require('../models/loanModel');
const Payment = require('../models/paymentModel');
const Customer = require('../models/customerModel');
const { Op } = require('sequelize');

const createLoan = async (req, res) => {
  const { customer_id, loan_amount: P, loan_period_years: N, interest_rate: R } = req.body;
  if (!customer_id || !P || !N || !R) return res.status(400).json({ error: 'Invalid data' });

  let customer = await Customer.findByPk(customer_id);
  if (!customer) customer = await Customer.create({ customer_id, name: '' });

  const I = P * N * R / 100;
  const A = parseFloat(P) + parseFloat(I);
  const monthly_emi = A / (N * 12);

  const loan = await Loan.create({
    loan_id: uuidv4(),
    customer_id,
    principal_amount: P,
    interest_rate: R,
    loan_period_years: N,
    total_amount: A,
    monthly_emi
  });

  res.status(201).json({ loan_id: loan.loan_id, customer_id, total_amount_payable: A, monthly_emi });
};

const addPayment = async (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;
  const loan = await Loan.findByPk(loan_id);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  await Payment.create({ payment_id: uuidv4(), loan_id, amount, payment_type });

  const payments = await Payment.findAll({ where: { loan_id } });
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  let balance = parseFloat(loan.total_amount) - totalPaid;
  const EmiCount = loan.loan_period_years * 12;
  const emis_left = Math.ceil(balance / parseFloat(loan.monthly_emi));

  if (balance <= 0) await loan.update({ status: 'PAID_OFF' });

  return res.json({ payment_id: payments.slice(-1)[0].payment_id, loan_id, remaining_balance: balance, emis_left });
};

const getLedger = async (req, res) => {
  const { loan_id } = req.params;
  const loan = await Loan.findByPk(loan_id, { include: Payment });
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  const totalPaid = loan.Payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const balance = parseFloat(loan.total_amount) - totalPaid;
  const emis_left = Math.ceil(balance / parseFloat(loan.monthly_emi));

  res.json({
    loan_id,
    customer_id: loan.customer_id,
    principal: parseFloat(loan.principal_amount),
    total_amount: parseFloat(loan.total_amount),
    monthly_emi: parseFloat(loan.monthly_emi),
    amount_paid: totalPaid,
    balance_amount: balance,
    emis_left,
    transactions: loan.Payments.map(p => ({
      transaction_id: p.payment_id,
      date: p.payment_date,
      amount: parseFloat(p.amount),
      type: p.payment_type
    }))
  });
};

const customerOverview = async (req, res) => {
  const { customer_id } = req.params;
  const loans = await Loan.findAll({ where: { customer_id } });
  if (!loans.length) return res.status(404).json({ error: 'No loans found' });

  const overview = await Promise.all(loans.map(async loan => {
    const payments = await Payment.findAll({ where: { loan_id: loan.loan_id } });
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalInterest = parseFloat(loan.total_amount) - parseFloat(loan.principal_amount);
    const emis_left = Math.ceil((parseFloat(loan.total_amount) - totalPaid) / parseFloat(loan.monthly_emi));
    return {
      loan_id: loan.loan_id,
      principal: parseFloat(loan.principal_amount),
      total_interest: totalInterest,
      total_amount: parseFloat(loan.total_amount),
      emi_amount: parseFloat(loan.monthly_emi),
      amount_paid: totalPaid,
      emis_left
    };
  }));

  res.json({ customer_id, total_loans: loans.length, loans: overview });
};

module.exports = { createLoan, addPayment, getLedger, customerOverview };
