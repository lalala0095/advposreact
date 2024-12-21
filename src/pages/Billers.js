import React from 'react';
import BillersTable from '../components/BillersTable';
import styled from 'styled-components';

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
  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <h1>Manage Billers</h1>
        <BillersTable />
      </ContentContainer>
    </PageContainer>
  );
};

export default BillersPage;
