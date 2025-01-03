import styled from 'styled-components';

export const DashboardContainer = styled.div`
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
  gap: 20px;
  justify-content: space-around;
  align-items: stretch;
`;

export const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
  
  .row {
    display: flex;
    width: 100%;
  }

  .col {
    flex: 1; 
    padding: 10px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      flex: 100%;
    }
  }
`;

export const Section = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column; /* Stack content vertically in each chart */
  min-width: 300px; /* Ensures a minimum width for smaller screens */
  max-width: 33%; /* Allows three charts to sit next to each other */
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    text-align: center;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    max-width: 100%; /* Allow full width for smaller screens */
  }
`;

export const LoginMessage = styled.p`
  color: ${(props) => props.theme.errorColor || 'red'};
  text-align: center;
  font-size: 1.2rem;
  width: 100%;
`;

export const CardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;
