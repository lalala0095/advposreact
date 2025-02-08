import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FaPiggyBank, FaBars, FaHome, FaChartBar, FaCog, FaSignInAlt, FaUserPlus, FaHandHoldingUsd, FaAddressCard, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaMoneyBill1Wave } from 'react-icons/fa6';

// Styled Sidebar
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
  z-index: 9999;
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

const MenuItemlogout = styled(Link)`
  color: ${(props) => props.theme.sidebarTextColor};
  text-decoration: none;
  font-size: 20px;
  margin-top: auto;
  margin-bottom: 20px;
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
  background-color: #e74c3c;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto;
  margin-bottom: 20px;

  &:hover {
    background-color: #c0392b;
  }
`;

// Styled Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: grey;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  max-width: 90%;
`;

const Sidebar = ({ onSidebarToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isSidebarVisible = location.pathname !== '/';

  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state

  const handleLogout = () => {
    logout(); // Clear session
    navigate('/'); // Redirect to login page
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onSidebarToggle(!isSidebarOpen);
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
    <>
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
          <FaMoneyBill1Wave />
          {isSidebarOpen && 'Cash Flows'}
        </MenuItem>
        <MenuItem to="/expenses" isSidebarOpen={isSidebarOpen}>
          <FaChartBar />
          {isSidebarOpen && 'Expenses'}
        </MenuItem>
        <MenuItem to="/planners" isSidebarOpen={isSidebarOpen}>
          <FaPiggyBank />
          {isSidebarOpen && 'Planners'}
        </MenuItem>
        <MenuItem to="/about_the_dev" isSidebarOpen={isSidebarOpen}>
          <FaAddressCard />
          {isSidebarOpen && 'About Us'}
        </MenuItem>
        <MenuItem to="/settings" isSidebarOpen={isSidebarOpen}>
          <FaCog />
          {isSidebarOpen && 'Settings'}
        </MenuItem>
        <MenuItemlogout 
        onClick={() => setModalIsOpen(true)} 
        isSidebarOpen={isSidebarOpen}
        >
          <FaSignOutAlt />
          {isSidebarOpen && 'Logout'}
        </MenuItemlogout>

        {/* {isAuthenticated && (
          <FaSignOutAlt>
            <LogoutButton onClick={() => setModalIsOpen(true)}>
              {isSidebarOpen && 'Logout'}
            </LogoutButton>
          </FaSignOutAlt>
        )} */}
      </SidebarWrapper>

      {/* Logout Confirmation Modal */}
      {modalIsOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Are you sure you want to logout?</h3>
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={handleLogout}
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  padding: '8px 15px',
                  marginRight: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                style={{
                  background: '#ccc',
                  padding: '8px 15px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Cancel
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Sidebar;
