// FlashMessage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FlashMessageWrapper = styled.div`
  background-color: #28a745; /* Green background for success */
  color: white;
  padding: 10px;
  margin-top: 20px; /* Ensure space between message and form */
  border-radius: 5px;
  text-align: center;
  width: 100%;
  margin: 0 auto; /* Center it horizontally */
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
