import React from 'react';
import { Typography } from '@mui/material';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Typography variant="body2" align="center">
        © 2024 Expense Tracker
      </Typography>
    </footer>
  );
};

export default Footer;
