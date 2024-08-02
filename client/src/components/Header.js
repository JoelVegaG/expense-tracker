import React from 'react';
import ProfileIcon from './ProfileIcon';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Expense Tracker</h1>
      <ProfileIcon />
    </header>
  );
};

export default Header;
