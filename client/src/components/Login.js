// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Card, Link } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Login.module.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://expense-tracker123-7ef8373dc83b.herokuapp.com/api/login', { username, password });
      const { userId } = response.data; // Assuming the response includes the user ID
      login(userId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Container maxWidth="xs" className={styles.container}>
        <Card className={styles.card}>
          <Box>
            <Typography variant="h5" gutterBottom>Login</Typography>
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
              onClick={handleLogin}
              className={styles.button}
            >
              Login
            </Button>
            <Box className={styles.registerPrompt}>
              <Typography variant="body2" align="center">
                Are you not registered yet?{' '}
                <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
                  Register
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

export default Login;
