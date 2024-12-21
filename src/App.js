// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppWrapper, ContentWrapper } from './styles/GlobalStyles';
import theme from './styles/theme';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Login from './pages/Login';
import AuthProvider from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Billers from './pages/Billers';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppWrapper>
            <Sidebar onSidebarToggle={handleSidebarToggle} />
            <ContentWrapper isSidebarOpen={isSidebarOpen}>
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/billers"
                  element={
                    <ProtectedRoute>
                      <Billers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ContentWrapper>
          </AppWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
