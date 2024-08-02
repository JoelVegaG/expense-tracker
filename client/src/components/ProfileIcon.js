// src/components/ProfileIcon.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ProfileIcon.module.css';

const ProfileIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.profileIcon}>
      <button onClick={handleMenuToggle} className={styles.icon}>
        👤
      </button>
      {menuOpen && (
        <div className={styles.menu}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
