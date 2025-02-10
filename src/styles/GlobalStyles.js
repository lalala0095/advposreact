import styled, {createGlobalStyle} from 'styled-components';

export const AppWrapper = styled.div`
  border: 1px solid green;
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: "center";
`;

export const ContentWrapper = styled.div`
  border: 1px solid red;
  overflow-x: auto;
  margin-bottom: 1vh;
  margin-left: ${(props) => (props.isSidebarOpen ? '18vh' : '2.5vh')};
  width: 100%;
  transition: margin-left 0.3s ease;
  padding: 20px;
  background-color: ${(props) => props.theme.contentBackground};

  /* Ensure no forced height */
  min-height: auto;
  height: 100%;
  display: block; /* Removes any flexbox-related positioning */
`;

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0; 
    overflow-y: auto;
    overflow-x: hidden;
  }

  body {
  border: 1px solid red;
  font-size: 1.5vh;
  }

  @media (max-width: 1200px) {
    body {
      font-size: 1.2vh;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 1vh;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 0.75vh;
    }
  }
`;

export default GlobalStyle;
