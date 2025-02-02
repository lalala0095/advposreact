// src/components/LandPageHeader.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderWrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #2f3640, #212f3c); /* Dark gradient background */
  padding: 20px 40px; /* Increased horizontal padding */
  color: white; /* Light text color */
  height: 80px; /* Adjust the height for the header */
  display: flex;
  justify-content: space-between; /* Space out the items */
  align-items: center;
  text-align: center;
  border-radius: 10px; /* Slightly rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Deeper shadow for depth */
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure it stays above other content */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
  opacity: 0.85;

  /* Add hover effect */
  &:hover {
    background: linear-gradient(135deg, #212f3c, #2f3640); /* Reverse gradient effect on hover */
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5); /* Enhanced shadow on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }
`;

// const Button = styled(Link)`
//   margin-right: 30px;
//   padding: 12px 25px;
//   background: linear-gradient(145deg, #6e7dff, #5767ea); /* Gradient background for a modern look */
//   color: white;
//   text-decoration: none;
//   border-radius: 50px; /* Rounded corners for a smooth look */
//   font-size: 1.2rem;
//   font-weight: 600;
//   text-transform: uppercase;
//   display: inline-block;
//   transition: all 0.3s ease; /* Smooth transition for hover effects */
//   box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
  
//   &:hover {
//     background: linear-gradient(145deg, #5767ea, #6e7dff); /* Reverse gradient for hover effect */
//     box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.15), -4px -4px 10px rgba(0, 0, 0, 0.1); /* Enhance shadow on hover */
//     transform: translateY(-3px); /* Lift the button slightly on hover */
//   }

//   &:active {
//     transform: translateY(1px); /* Slightly depress the button on click */
//     box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(0, 0, 0, 0.1); /* Reduced shadow on active */
//   }
// `;

// const LoginButton = styled(Button)`
//   background: linear-gradient(145deg, #6e7dff, #5767ea); /* Modern gradient background */
  
//   &:hover {
//     background: linear-gradient(145deg, #5767ea, #6e7dff);
//   }
// `;

// const SignUpButton = styled(Button)`
//   background: linear-gradient(145deg, #8cc63f, #7da736); /* Green gradient background */
  
//   &:hover {
//     background: linear-gradient(145deg, #7da736, #8cc63f);
//   }
// `;

//  ----------DEEP SEEK VERSION
export const LoginButton = styled(Link)`
  padding: 12px 24px;
  background: linear-gradient(135deg, rgb(94, 89, 152) 0%, rgb(123, 118, 180) 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgb(35, 35, 82) 0%, rgb(65, 65, 120) 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const SignUpButton = styled(Link)`
  padding: 12px 24px;
  background: rgba(102, 114, 102, 0.52);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: 10px;
  margin-right: 60px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(158, 175, 159, 0.09);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const LandPageHeader = () => {
  return (
    <HeaderWrapper>
      <h1>AdvPOS App</h1>
      <h3>Make your Expenses and Cash Flow tracking intuitive and insightful.</h3>
      <div>
        <LoginButton to="/login">Login</LoginButton>
        <SignUpButton to="/signup">Signup</SignUpButton>
      </div>
    </HeaderWrapper>
  );
};

export default LandPageHeader;
