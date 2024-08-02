import React, { useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../styles/ExpenseTable.module.css';
import EditExpenseModal from './EditExpenseModal';

const ExpenseTable = ({ expenses, fetchExpenses, currentMonth }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/expenses/${id}`);
      fetchExpenses(currentMonth); // Refresh the expenses list after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <>
      {isSmallScreen ? (
        <Box className={styles.cardContainer}>
          {expenses.map(expense => (
            <Box key={expense._id} className={styles.card}>
              <Typography variant="h6">{expense.description}</Typography>
              <Typography variant="body1">Amount: ${expense.amount.toFixed(2)}</Typography>
              <Typography variant="body1">Month: {expense.month}</Typography>
              <Typography variant="body1">Category: {expense.category}</Typography>
              <Box className={styles.cardActions}>
                <IconButton
                  color="primary"
                  onClick={() => setEditingExpense(expense)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(expense._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.cellHeader}>Description</TableCell>
                <TableCell className={styles.cellHeader}>Amount</TableCell>
                <TableCell className={styles.cellHeader}>Month</TableCell>
                <TableCell className={styles.cellHeader}>Category</TableCell>
                <TableCell className={styles.cellHeader}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map(expense => (
                <TableRow key={expense._id} className={styles.tableRow}>
                  <TableCell className={styles.cell} data-label="Description">
                    {expense.description}
                  </TableCell>
                  <TableCell className={styles.cell} data-label="Amount">
                    {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className={styles.cell} data-label="Month">
                    {expense.month}
                  </TableCell>
                  <TableCell className={styles.cell} data-label="Category">
                    {expense.category}
                  </TableCell>
                  <TableCell className={styles.cell} data-label="Actions">
                    <IconButton
                      color="primary"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(expense._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          fetchExpenses={fetchExpenses}
          currentMonth={currentMonth}
        />
      )}
    </>
  );
};

export default ExpenseTable;
