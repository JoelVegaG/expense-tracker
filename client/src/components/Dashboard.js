import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { format, addMonths, subMonths, startOfYear, parse } from 'date-fns';
import { Container, Typography, Button, Select, MenuItem, IconButton, Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ExpenseTable from './ExpenseTable';
import AddExpenseModal from './AddExpenseModal';
import ExpensePieChart from './ExpensePieChart';
import ExpenseBarChart from './ExpenseBarChart';
import styles from '../styles/Dashboard.module.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM'));
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useContext(AuthContext);

  // Create a ref to the content to be saved as PDF
  const pdfContentRef = useRef(null);

  const fetchExpenses = async (month) => {
    try {
      const response = await axios.get(`https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/expenses/${month}/${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleAddExpense = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchExpenses(selectedMonth); // Refresh expenses list after closing modal
  };

  const handlePreviousMonth = () => {
    const newDate = subMonths(parse(`${selectedMonth} 01, ${new Date().getFullYear()}`, 'MMMM dd, yyyy', new Date()), 1);
    setSelectedMonth(format(newDate, 'MMMM'));
  };

  const handleNextMonth = () => {
    const newDate = addMonths(parse(`${selectedMonth} 01, ${new Date().getFullYear()}`, 'MMMM dd, yyyy', new Date()), 1);
    setSelectedMonth(format(newDate, 'MMMM'));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(format(new Date(), 'MMMM'));
  };

  const handleSaveAsPDF = async () => {
    const element = pdfContentRef.current;

    if (!element) return;

    // Temporarily make the element visible
    element.style.display = 'block';

    // Wait for the element to render
    await new Promise(resolve => setTimeout(resolve, 500));

    html2canvas(element, { scale: 2, useCORS: true })
      .then(canvas => {
        if (canvas.width === 0 || canvas.height === 0) {
          console.error('Canvas dimensions are zero.');
          element.style.display = 'none'; // Re-hide the element
          return;
        }

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        let heightLeft = imgHeight - pdf.internal.pageSize.height;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.height;
        }

        pdf.save(`${selectedMonth}_Expense_Report.pdf`);

        element.style.display = 'none'; // Re-hide the element
      })
      .catch(err => {
        console.error('Error generating PDF:', err);
        element.style.display = 'none'; // Re-hide the element
      });
  };

  const generateMonths = () => {
    const start = startOfYear(new Date());
    return Array.from({ length: 12 }, (_, i) => format(addMonths(start, i), 'MMMM'));
  };

  const months = generateMonths();

  return (
    <Container className={styles.dashboard}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Box className={styles.controlsContainer}>
        <Box className={styles.controlSectionLeft}>
          <IconButton onClick={handlePreviousMonth} className={styles.navButton}>
            <ArrowBackIosIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCurrentMonth}
            className={styles.currentMonthButton}
          >
            Current Month
          </Button>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.select}
          >
            {months.map(month => (
              <MenuItem key={month} value={month}>{month}</MenuItem>
            ))}
          </Select>
          <IconButton onClick={handleNextMonth} className={styles.navButton}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Box className={styles.controlSectionRight}>
          <IconButton
            color="primary"
            onClick={handleAddExpense}
            className={styles.iconButton}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={handleSaveAsPDF}
            className={styles.iconButton}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>
      <ExpenseTable 
        expenses={expenses} 
        fetchExpenses={fetchExpenses} 
        currentMonth={selectedMonth}
      />
      <ExpensePieChart expenses={expenses} className={styles.pieChart} />
      <div ref={pdfContentRef} className={styles.hidden}>
        <ExpenseBarChart expenses={expenses} />
        <ExpenseTable 
          expenses={expenses} 
          fetchExpenses={fetchExpenses} 
          currentMonth={selectedMonth}
        />
      </div>
      {isModalOpen && (
        <AddExpenseModal 
          onClose={handleCloseModal} 
          currentMonth={selectedMonth} 
          fetchExpenses={fetchExpenses}
        />
      )}
    </Container>
  );
};

export default Dashboard;
