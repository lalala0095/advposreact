// FlashMessage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FlashMessageWrapper = styled.div`
  background-color: #28a745; /* Green background for success */
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
`;

const FlashMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      // Hide the message after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      // Cleanup the timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible || !message) return null;

  return (
    <FlashMessageWrapper>
      <p>{message}</p>
    </FlashMessageWrapper>
  );
};

export default FlashMessage;
