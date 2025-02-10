import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  border: 1px solid red;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: grey;
  opacity: 0.9;
  padding: 20px;
  color: #fff;
  height: 1%;
  max-height: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.75rem;
`;

const Footer = () => {
  return (
    <FooterWrapper className='footer-wrapper'>
      <h1>Website Under Construction</h1>
    </FooterWrapper>
  );
};

export default Footer;
