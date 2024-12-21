// FlashMessage.js
import React from 'react';
import styled from 'styled-components';

const FlashMessageWrapper = styled.div`
  background-color: #28a745; /* Green background for success */
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
`;

const FlashMessage = ({ message }) => (
  <FlashMessageWrapper>{message}</FlashMessageWrapper>
);

export default FlashMessage;
