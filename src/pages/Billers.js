import React, { useState } from 'react';
import BillersTable from '../components/BillersTable';
import styled from 'styled-components';
import FlashMessage from '../components/FlashMessage'; // Import FlashMessage component

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '250px' : '0')}; /* Adjust for sidebar */
  transition: margin-left 0.3s ease-in-out;
`;

const BillersPage = ({ sidebarOpen }) => {
  // Local state to manage flash messages
  const [flashMessage, setFlashMessage] = useState('');

  // Function to set flash message
  const handleFlashMessage = (message) => {
    setFlashMessage(message);

    // Automatically hide the message after 3 seconds (for example)
    setTimeout(() => {
      setFlashMessage('');
    }, 3000);
  };

  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <h1>Manage Billers</h1>
        {flashMessage && <FlashMessage message={flashMessage} />} {/* Display flash message if it exists */}
        <BillersTable handleFlashMessage={handleFlashMessage} />
      </ContentContainer>
    </PageContainer>
  );
};

export default BillersPage;
