import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; // Import AuthContext
import styled from 'styled-components';

// Styled Logout Button
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

// Styled Modal Container
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  max-width: 90%;
`;

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
`;

const Logout = () => {
  const { logout } = useContext(AuthContext); // Get logout function from context
  const navigate = useNavigate(); // For redirection
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to handle modal visibility

  const handleLogout = () => {
    logout(); // Clear session & user data
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      {/* Logout Button */}
      <LogoutButton onClick={() => setModalIsOpen(true)}>Logout</LogoutButton>

      {/* Confirmation Modal */}
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

export default Logout;
