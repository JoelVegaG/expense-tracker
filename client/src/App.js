// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/expense-tracker">  {/* Ensure this matches your GitHub Pages URL path */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RedirectBasedOnAuth />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Component to handle redirection based on auth status
const RedirectBasedOnAuth = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

// Component to protect routes
const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
