CREATE TABLE Customers (
  customer_id TEXT PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Loans (
  loan_id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES Customers(customer_id),
  principal_amount DECIMAL,
  interest_rate DECIMAL,
  loan_period_years INTEGER,
  total_amount DECIMAL,
  monthly_emi DECIMAL,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payments (
  payment_id TEXT PRIMARY KEY,
  loan_id TEXT REFERENCES Loans(loan_id),
  amount DECIMAL,
  payment_type TEXT,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
