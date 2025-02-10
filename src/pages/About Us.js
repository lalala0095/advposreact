import React from 'react';
import styled from 'styled-components';

const AboutTheDevWrapper = styled.div`
  border: 1px solid blue;
  overflow-x: auto;
  margin-bottom: 1vh;
  margin-left: ${(props) => (props.isSidebarOpen ? '18vh' : '2.5vh')};
  width: calc(100% - ${(props) => (props.isSidebarOpen ? '18vh' : '2.5vh')}); /* Adjust width dynamically */
  transition: margin-left 0.3s ease, width 0.3s ease;
  padding: 20px;
  background-color: ${(props) => props.theme.contentBackground};
  align-self: center;
  min-height: auto;
  height: 100%;
  display: block;

  @media (max-width: 1200px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '20vh' : '7vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '0.5vh' : '2vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '1vh' : '1.5vh')};
    width: calc(100% - ${(props) => (props.isSidebarOpen ? '20vh' : '7vh')});
  }

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '15vh' : '5vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '0.1vh' : '1vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '1.5vh' : '2vh')};
    width: calc(100% - ${(props) => (props.isSidebarOpen ? '15vh' : '5vh')});
  }

  @media (max-width: 480px) {
    margin-left: ${(props) => (props.isSidebarOpen ? '10vh' : '4.5vh')};
    margin-right: ${(props) => (props.isSidebarOpen ? '1vh' : '6vh')};
    font-size: ${(props) => (props.isSidebarOpen ? '1vh' : '1.5vh')};
    width: calc(100% - ${(props) => (props.isSidebarOpen ? '10vh' : '4.5vh')});
  }
`;

const AboutTheDev = ({ isSidebarOpen }) => {
  return (
    <AboutTheDevWrapper isSidebarOpen={isSidebarOpen}>
      <h2>About the Dev</h2>
      <p>Welcome to the About the Dev page. This is where the profile of the developer will go.</p>
    </AboutTheDevWrapper>
  );
};

export default AboutTheDev;
