import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; // Import AuthContext
import styled from 'styled-components';

export const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c; /* A distinct red for logout */
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto; /* Push the logout button to the bottom */
  margin-bottom: 20px; /* Adds margin to the bottom */
  
  &:hover {
    background-color: #c0392b; /* Darker red on hover */
  }
`;

const Logout = () => {
  const { logout } = useContext(AuthContext); // Get logout function from context
  const navigate = useNavigate(); // To redirect the user after logout

  const handleLogout = () => {
    logout(); // Call the logout function from context to clear the session and user data
    navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
  );
};

export default Logout;
