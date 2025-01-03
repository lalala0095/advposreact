import { DashboardContainer, Section, LoginMessage, CardWrapper } from '../styles/Dashboard'
import DailyCashFlowChart from "../components/DailyCashFlowChart";
import SummaryCard from '../components/SummaryCard';
import apiService from '../services/apiService';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const [ total_expenses, setTotalExpenses ] = useState(0);
  const [ total_cash_flows, setTotalCF ] = useState(0);
  const [ which_is_higher, setHigher ] = useState(0);
  const [ difference, setDiff ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const response = await apiService.getDailyReports();
        setTotalExpenses(response.total_expenses);
        setTotalCF(response.total_cash_flows);
        setHigher(response.which_is_higher);
        setDiff(response.difference);
      } catch (error) {
        console.error("Failed to fetch total expenses: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalExpenses();
  }, []);

  return (
    <DashboardContainer>
      {/* <div>
        <h2>Dashboard</h2>
        <p>Welcome to the Dashboard. This is where the main reports and visualizations will go.</p>
      </div> */}
      {token ? (
        <div>
            <CardWrapper className='row'>
              <div className='col-sm-6'>
                <SummaryCard
                  title="Total Expenses"
                  value={total_expenses}
                />
              </div>
              <div className='col-sm-6'>
                <SummaryCard
                  title="Total Cash Flows"
                  value={total_cash_flows}
                />
              </div>
              <div className='col-sm-6'>
                <SummaryCard
                  title="Which is Higher"
                  value={which_is_higher}
                />
              </div>
              <div className='col-sm-6'>
                <SummaryCard
                  title="Difference"
                  value={difference}
                />
              </div>
            </CardWrapper>
          <Section>
            <h3>Daily Cash Flows and Expenses Comparison</h3>
            <DailyCashFlowChart />
          </Section>
        </div>
      ) : (
        <LoginMessage>Login to view Dashboard content.</LoginMessage>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;