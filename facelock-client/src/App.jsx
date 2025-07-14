import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import VerifyEmail from './components/VerifyEmail';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
