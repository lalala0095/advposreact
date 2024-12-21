// styles/GlobalStyles.js
// import styled from 'styled-components';

// export const AppWrapper = styled.div`
//   display: flex;
//   height: 100vh;
//   background-color: ${(props) => props.theme.backgroundColor};
//   color: ${(props) => props.theme.textColor};
// `;

// export const ContentWrapper = styled.div`
//   flex-grow: 1;
//   padding: 20px;
//   overflow-y: auto;
// `;

// styles/GlobalStyles.js
import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: flex;
`;

export const ContentWrapper = styled.div`
  margin-left: ${(props) => (props.isSidebarOpen ? '250px' : '60px')};
  width: 100%;
  transition: margin-left 0.3s ease;
  padding: 20px;
  background-color: ${(props) => props.theme.contentBackground};
`;

