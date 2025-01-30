import styled, {createGlobalStyle} from 'styled-components';

export const AppWrapper = styled.div`
  display: flex;
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: "center";
`;

export const ContentWrapper = styled.div`
  margin-left: ${(props) => (props.isSidebarOpen ? '250px' : '60px')};
  width: 100%;
  transition: margin-left 0.3s ease;
  padding: 20px;
  background-color: ${(props) => props.theme.contentBackground};
`;

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0; /* Remove any default margin */
    padding: 0; /* Remove any default padding */
    overflow-y: auto; /* Allow vertical scrollbar when content overflows */
    overflow-x: hidden; /* Prevent horizontal scrollbar */
  }
`;

export default GlobalStyle;
