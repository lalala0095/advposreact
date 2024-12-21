import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  background-color: #333;
  padding: 20px;
  text-align: center;
  color: #fff;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <h1>AdvPOS App</h1>
    </HeaderWrapper>
  );
};

export default Header;
