// src/components/MainLayout.js
import React from 'react';
import { Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/MainLayout.module.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className={styles.appContainer}>
      {!isAuthPage && <Header />}
      <Container component="main" className={`${styles.mainContent} ${isAuthPage ? styles.fixedFooter : ''}`}>
        {children}
      </Container>
      {!isAuthPage && <Footer className={styles.footerFixed} />}
    </div>
  );
};

export default MainLayout;
