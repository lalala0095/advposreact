import styled from 'styled-components';

export const DashboardContainer = styled.div`
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: stretch;
`;

export const Section = styled.div`
  flex: 1 1 calc(50% - 20px); /* Adjusts for two equal-width sections in a row */
  min-width: 300px; /* Ensures a minimum width for smaller screens */
  max-width: 500px; /* Optional max width for larger displays */
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  h3 {
    text-align: center;
    margin-bottom: 10px;
  }
`;

export const LoginMessage = styled.p`
  color: ${(props) => props.theme.errorColor || 'red'};
  text-align: center;
  font-size: 1.2rem;
  width: 100%;
`;
