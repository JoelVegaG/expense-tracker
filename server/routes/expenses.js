const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { format } = require('date-fns');

// Add a new expense
router.post('/', async (req, res) => {
  const { description, amount, dues, currentMonth, category, userId } = req.body;
  const monthlyAmount = amount / dues; // Calculate the equal amount for each month

  try {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    // Save the expense for the current month and future months
    for (let i = 0; i < dues; i++) {
      const futureDate = new Date(currentDate.getFullYear(), currentMonthIndex + i, 1);
      const futureMonth = format(futureDate, 'MMMM');

      await Expense.findOneAndUpdate(
        { description, month: futureMonth },
        { 
          $inc: { amount: monthlyAmount },
          $set: { userId, category }
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: 'Expense added/updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get expenses for a specific month
router.get('/:month/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ month: req.params.month, userId: req.params.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, dues, category } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { description, amount, dues, category },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
