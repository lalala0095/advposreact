import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  margin-top: 0;
  width: 100%;
  background-color: #333;
  padding: 20px;
  color: #fff;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;
  position: fixed;
`;

const Header = () => {
  return (
    <HeaderWrapper style={{ marginTop: 0 }}>
      <h1>AdvPOS App</h1>
    </HeaderWrapper>
  );
};

export default Header;
