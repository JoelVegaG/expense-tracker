import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CRC_TO_USD_CONVERSION_RATE, convertCRCtoUSD } from '../constants/currency';
import { categories } from '../constants/categories';  
import styles from '../styles/ExpenseTable.module.css';

const EditExpenseModal = ({ expense, onClose, fetchExpenses, currentMonth }) => {
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [dues, setDues] = useState(expense.dues);
  const [category, setCategory] = useState(expense.category || 'Other');
  const [hasDues, setHasDues] = useState(expense.dues > 1);
  const [isInCRC, setIsInCRC] = useState(expense.amount * CRC_TO_USD_CONVERSION_RATE === amount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert amount to USD if entered in CRC
    const amountInUSD = isInCRC ? convertCRCtoUSD(parseFloat(amount)) : parseFloat(amount);

    const updatedExpense = {
      description,
      amount: amountInUSD,
      dues: hasDues ? parseInt(dues, 10) : 1,
      currentMonth,
      category,
    };

    try {
      await axios.put(`https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/expenses/${expense._id}`, updatedExpense);
      console.log('Expense updated successfully');
      fetchExpenses(currentMonth);
    } catch (error) {
      console.error('Error updating expense:', error);
    }

    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            margin="dense"
          />
          <FormControl fullWidth margin="dense" className={styles.selectContainer}>
            <Select
              value={isInCRC ? 'CRC' : 'USD'}
              onChange={(e) => setIsInCRC(e.target.value === 'CRC')}
              className={styles.select}
            >
              <MenuItem value="CRC">CRC (Colones)</MenuItem>
              <MenuItem value="USD">USD (Dollars)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" className={styles.selectContainer}>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasDues}
                onChange={(e) => setHasDues(e.target.checked)}
              />
            }
            label="Has Dues"
          />
          {hasDues && (
            <TextField
              label="Dues"
              type="number"
              value={dues}
              onChange={(e) => setDues(e.target.value)}
              fullWidth
              required
              margin="dense"
            />
          )}
          <DialogActions className={styles.actions}>
            <Button type="submit" variant="contained" color="primary">Save</Button>
            <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;
