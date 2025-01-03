import { DashboardContainer, Section, LoginMessage } from '../styles/Dashboard'
import DailyCashFlowChart from "../components/DailyCashFlowChart";

const Dashboard = () => {
  const token = localStorage.getItem('token');

  return (
    <DashboardContainer>
      {/* <div>
        <h2>Dashboard</h2>
        <p>Welcome to the Dashboard. This is where the main reports and visualizations will go.</p>
      </div> */}
      {token ? (
        <>
          <Section>
            <h3>Daily Cash Flows and Expenses Comparison</h3>
            <DailyCashFlowChart />
          </Section>
        </>
      ) : (
        <LoginMessage>Login to view Dashboard content.</LoginMessage>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;