import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Login from './pages/Login';

// Define the dark theme
const theme = {
  backgroundColor: '#121212',
  textColor: '#E0E0E0',
  sidebarBackground: '#1E1E1E',
  sidebarTextColor: '#A0A0A0',
};

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppWrapper>
          <Sidebar />
          <ContentWrapper>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </ContentWrapper>
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
};

export default App;
