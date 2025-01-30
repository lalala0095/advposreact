// Sidebar.js
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FaBars, FaHome, FaChartBar, FaCog, FaSignInAlt, FaUserPlus, FaHandHoldingUsd, FaAddressCard } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const SidebarWrapper = styled.div`
  width: ${(props) => (props.isSidebarOpen ? '250px' : '60px')};
  background-color: ${(props) => props.theme.sidebarBackground};
  transition: width 0.3s;
  position: fixed;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: ${(props) => (props.isSidebarVisible ? 'flex' : 'none')};
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
`;

const MenuItem = styled(Link)`
  color: ${(props) => props.theme.sidebarTextColor};
  text-decoration: none;
  font-size: 20px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #333;
  }
  svg {
    margin-right: ${(props) => (props.isSidebarOpen ? '10px' : '0')};
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c; /* A distinct red for logout */
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto; /* Push the logout button to the bottom */
  margin-bottom: 20px;  

  &:hover {
    background-color: #c0392b; /* Darker red on hover */
  }
`;

const Sidebar = ({ onSidebarToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isSidebarVisible = location.pathname !== '/';

  const handleLogout = () => {
    logout(); // Call the logout function from context to clear session data
    navigate('/'); // Redirect to login page after logout
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onSidebarToggle(!isSidebarOpen); // Pass the state to App.js
  };

  if (!isAuthenticated) {
    return (
      <SidebarWrapper isSidebarOpen={isSidebarOpen} isSidebarVisible={isSidebarVisible}>
        <SidebarHeader>
          <FaBars onClick={handleSidebarToggle} />
        </SidebarHeader>
        <MenuItem to="/login" isSidebarOpen={isSidebarOpen}>
          <FaSignInAlt />
          {isSidebarOpen && 'Login'}
        </MenuItem>
        <MenuItem to="/signup" isSidebarOpen={isSidebarOpen}>
          <FaUserPlus />
          {isSidebarOpen && 'Owner Signup'}
        </MenuItem>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper isSidebarOpen={isSidebarOpen} isSidebarVisible={isSidebarVisible}>
      <SidebarHeader>
        <FaBars onClick={handleSidebarToggle} />
      </SidebarHeader>
      <MenuItem to="/dashboard" isSidebarOpen={isSidebarOpen}>
        <FaHome />
        {isSidebarOpen && 'Dashboard'}
      </MenuItem>
      <MenuItem to="/billers" isSidebarOpen={isSidebarOpen}>
        <FaHandHoldingUsd />
        {isSidebarOpen && 'Billers'}
      </MenuItem>
      <MenuItem to="/cash_flows" isSidebarOpen={isSidebarOpen}>
        <FaHandHoldingUsd />
        {isSidebarOpen && 'Cash Flows'}
      </MenuItem>
      <MenuItem to="/expenses" isSidebarOpen={isSidebarOpen}>
        <FaChartBar />
        {isSidebarOpen && 'Expenses'}
      </MenuItem>
      <MenuItem to="/about_the_dev" isSidebarOpen={isSidebarOpen}>
        <FaAddressCard />
        {isSidebarOpen && 'About Us'}
      </MenuItem>
      <MenuItem to="/settings" isSidebarOpen={isSidebarOpen}>
        <FaCog />
        {isSidebarOpen && 'Settings'}
      </MenuItem>

      {isAuthenticated && (
        <LogoutButton onClick={handleLogout}>
          {isSidebarOpen && 'Logout'}
        </LogoutButton>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;
