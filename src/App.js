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
import Billers from './pages/Billers';
import EditBillerPage from './pages/EditBiller';
import CashFlows from './pages/CashFlows';
import EditCashFlow from './pages/EditCashFlow';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import Expenses from './pages/Expenses';
import EditExpensePage from './pages/EditExpense';
import AboutTheDev from './pages/About Us';

import AuthProvider from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppWrapper>
            <Sidebar onSidebarToggle={handleSidebarToggle} />
              <ContentWrapper isSidebarOpen={isSidebarOpen}>
                <Header />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={ <Signup /> } />
                  <Route path="/" element={ <Dashboard /> } />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/edit-biller/:billerId" element={<EditBillerPage />} />
                  <Route
                    path="/billers"
                    element={
                      <ProtectedRoute>
                        <Billers />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/edit-expense/:expenseId" element={<EditExpensePage />} />
                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute>
                        <Expenses />
                      </ProtectedRoute>
                    }
                  />                  
                  <Route path="/edit-cash_flow/:cash_flowId" element={<EditCashFlow />} />
                  <Route
                    path="/cash_flows"
                    element={
                      <ProtectedRoute>
                        <CashFlows />
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
                  <Route
                    path="/about_the_dev"
                    element={
                        <AboutTheDev />
                    }
                  />
                </Routes>
              </ContentWrapper>
            </AppWrapper>
          </AuthProvider>
        </Router>
    </ThemeProvider>
  );
};

export default App;
