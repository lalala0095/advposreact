import React from 'react';
import { LandPageAppWrapper } from '../styles/Landpage';
import LandPageHeader from '../components/LandPageHeader';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyle from '../styles/GlobalStyles';
import { AddButton } from '../styles/BillersStyles';
import { Link } from 'react-router-dom';

const LandPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LandPageAppWrapper>
        <LandPageHeader>
          <Link to="/login">
            <AddButton>Login</AddButton>
          </Link>
        </LandPageHeader>
      </LandPageAppWrapper>
    </ThemeProvider>
  );
};

export default LandPage;
