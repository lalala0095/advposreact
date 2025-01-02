import React from 'react';
import DailyCashFlowChart from '../components/DailyCashFlowChart';

const Dashboard = () => {
  return (
    <div>
      <div>
        <h2>Dashboard</h2>
        <p>Welcome to the Dashboard. This is where the main reports and visualizations will go.</p>
      </div>
      <div>
        <h3>Daily Cash Flow</h3>
        <DailyCashFlowChart />
      </div>
    </div>
  );
};

export default Dashboard;
