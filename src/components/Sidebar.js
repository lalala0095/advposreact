import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBars, FaHome, FaChartBar, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SidebarWrapper = styled.div`
  width: ${(props) => (props.isSidebarOpen ? '250px' : '60px')};
  background-color: ${(props) => props.theme.sidebarBackground};
  transition: width 0.3s;
  position: fixed;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
`;

const MenuItem = styled(Link)`
  color: ${(props) => props.theme.sidebarTextColor};
  text-decoration: none;
  font-size: 20px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #333;
  }
  svg {
    margin-right: ${(props) => (props.isSidebarOpen ? '10px' : '0')};
  }
`;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarWrapper isSidebarOpen={isSidebarOpen}>
      <SidebarHeader>
        <FaBars onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </SidebarHeader>
      <MenuItem to="/" isSidebarOpen={isSidebarOpen}>
        <FaHome />
        {isSidebarOpen && 'Home'}
      </MenuItem>
      <MenuItem to="/reports" isSidebarOpen={isSidebarOpen}>
        <FaChartBar />
        {isSidebarOpen && 'Reports'}
      </MenuItem>
      <MenuItem to="/settings" isSidebarOpen={isSidebarOpen}>
        <FaCog />
        {isSidebarOpen && 'Settings'}
      </MenuItem>
    </SidebarWrapper>
  );
};

export default Sidebar;
