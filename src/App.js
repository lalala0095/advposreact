import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppWrapper, ContentWrapper } from './styles/GlobalStyles';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyles';

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
import LandPage from './pages/Landpage'; // LandPage component
import AuthProvider from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Planners from './pages/Planner';
import EditPlannerPage from './pages/EditPlanner';
import Footer from './components/Footer';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header />
        <AuthProvider>
          <Routes>
            {/* LandPage Route - No Sidebar or Header */}
            <Route path="/" element={<LandPage />} />

            {/* Other Routes - with Sidebar and Header */}
            <Route
              path="/*"
              element={
                <AppWrapper className='app-wrapper'>
                  <Sidebar onSidebarToggle={handleSidebarToggle} />
                  <ContentWrapper isSidebarOpen={isSidebarOpen}>
                    
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/dashboard" element={<Dashboard />} />
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
                      <Route path="/edit-planner/:plannerId" element={<EditPlannerPage />} />
                      <Route
                        path="/planners"
                        element={
                          <ProtectedRoute>
                            <Planners />
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
                      <Route path="/about_the_dev" element={<AboutTheDev />} />
                    </Routes>
                    
                  </ContentWrapper>
                </AppWrapper>
              }
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
