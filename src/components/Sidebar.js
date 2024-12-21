// Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaHome, FaChartBar, FaCog, FaSignInAlt, FaUserPlus, FaHandHoldingUsd } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout(); // Call the logout function from context to clear session data
    navigate('/login'); // Redirect to login page after logout
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onSidebarToggle(!isSidebarOpen); // Pass the state to App.js
  };

  if (!isAuthenticated) {
    return (
      <SidebarWrapper isSidebarOpen={isSidebarOpen}>
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
    <SidebarWrapper isSidebarOpen={isSidebarOpen}>
      <SidebarHeader>
        <FaBars onClick={handleSidebarToggle} />
      </SidebarHeader>
      <MenuItem to="/" isSidebarOpen={isSidebarOpen}>
        <FaHome />
        {isSidebarOpen && 'Home'}
      </MenuItem>
      <MenuItem to="/billers" isSidebarOpen={isSidebarOpen}>
        <FaHandHoldingUsd />
        {isSidebarOpen && 'Billers'}
      </MenuItem>
      <MenuItem to="/reports" isSidebarOpen={isSidebarOpen}>
        <FaChartBar />
        {isSidebarOpen && 'Reports'}
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
