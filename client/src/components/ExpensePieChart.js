import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Typography, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import styles from '../styles/ExpensePieChart.module.css';

const ExpensePieChart = ({ expenses }) => {
  // Calculate total amount per category
  const categoryTotals = expenses.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // Convert category totals to array for PieChart
  const data = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category]
  }));

  // Calculate total amount
  const total = expenses.reduce((sum, { amount }) => sum + amount, 0).toFixed(2);

  // Define colors for the pie chart
  const COLORS = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6'];

  // Use theme and media query to check screen size
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card className={styles.pieChartCard}>
      <CardContent>
        <Typography variant="h6" align="center">Expenses by Category</Typography>
          <div className={styles.pieChartWrapper}>
            <PieChart width={400} height={400} className={styles.pieChart}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <Typography variant="h4" align="center" className={styles.totalOnly}>
            ${total}
          </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
