import styled, {createGlobalStyle} from 'styled-components';

export const AppWrapper = styled.div`
  border: 1px solid green;
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: "center";
  align-items: center;
  display: flex;
  height: 100%;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  border: 1px solid blue;
  overflow-x: auto;
  margin-top: 0vh;
  margin-bottom: 10vh;
  margin-left: ${(props) => (props.isSidebarOpen ? '18vh' : '2.5vh')};
  width: 120vw;
  transition: margin-left 0.3s ease;
  padding: 1vh;
  background-color: ${(props) => props.theme.contentBackground};
  align-self: center;
  /* Ensure no forced height */
  min-height: auto;
  height: 100%;
  display: block;

  @media (max-width: 1200px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '20vh' : '7vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '.5vh' : '2vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '1vh' : '1vh')};
  }

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '15vh' : '4vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '.1vh' : '0.5vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '.6vh' : '.6vh')};
  }

  @media (max-width: 480px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '10vh' : '4.5vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '1vh' : '1vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '1vh' : '1vh')};
    margin-bottom: 7vh;
  }

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
