const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  month: String,
  userId: String,
  category: {
    type: String,
    enum: ['Rent', 'Utilities', 'Groceries', 'Transportation', 'Entertainment', 'Other'] 
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
