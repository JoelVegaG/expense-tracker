// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Card, Link } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Register.module.css';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/register', { username, password });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error.response?.data?.message || error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Container maxWidth="xs" className={styles.container}>
        <Card className={styles.card}>
          <Box>
            <Typography variant="h5" gutterBottom>Register</Typography>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRegister}
              className={styles.button}
            >
              Register
            </Button>
            <Box className={styles.loginPrompt}>
              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link component="button" variant="body2" onClick={handleLoginRedirect}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default Register;
