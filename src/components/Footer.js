import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  // margin-bottom: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: grey;
  opacity: 0.5;
  padding: 20px;
  color: #fff;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.75rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <h1>Website Under Construction</h1>
    </FooterWrapper>
  );
};

export default Footer;
