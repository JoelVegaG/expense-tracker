import React, { useState, useContext  } from 'react';
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
import styles from '../styles/ExpenseTable.module.css';
import { convertCRCtoUSD } from '../constants/currency'; 
import { categories } from '../constants/categories'; 
import AuthContext from '../context/AuthContext';

const AddExpenseModal = ({ onClose, currentMonth, fetchExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dues, setDues] = useState(1);
  const [category, setCategory] = useState('Other'); // Default to 'Other'
  const [hasDues, setHasDues] = useState(true);
  const [isInCRC, setIsInCRC] = useState(true); // Default to CRC
  const { userId } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert amount to USD if entered in CRC
    const amountInUSD = isInCRC ? convertCRCtoUSD(parseFloat(amount)) : parseFloat(amount);

    const expense = {
      description,
      amount: amountInUSD,
      dues: hasDues ? parseInt(dues, 10) : 1,
      currentMonth,
      category,
      userId
    };

    try {
      await axios.post('https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/expenses', expense);
      console.log('Expense added successfully');
      fetchExpenses(currentMonth); // Refresh expenses list after adding a new one
    } catch (error) {
      console.error('Error adding expense:', error);
    }

    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add Expense</DialogTitle>
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
            <Button type="submit" variant="contained" color="primary">Add</Button>
            <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
