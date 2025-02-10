import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: rgba(86, 80, 80, 0.71);
  border-radius: 10px;
  padding: 2vh;
  min-width: 50px;
  max-width: 100px;
  text-align: center;
  flex: 1;
  margin: 10px;
  max-height: 80px
`;

const Title = styled.h3`
  font-size: 1.5vh;
  margin-bottom: 10px;
  color: white;
`;

const Value = styled.p`
  font-size: 2vh;
  font-weight: bold;
  color:rgb(255, 255, 255);
`;

const SummaryCard = ({ title, value, color }) => {
  return (
    <CardContainer>
      <Title color={color}>{title}</Title>
      <Value>{value}</Value>
    </CardContainer>
  );
};

export default SummaryCard;
