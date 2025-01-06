import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  background-color: #333;
  padding: 20px;
  color: #fff;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <h1>AdvPOS App</h1>
    </HeaderWrapper>
  );
};

export default Header;
