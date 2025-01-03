import { DashboardContainer, Section, LoginMessage, CardWrapper, ChartsContainer } from '../styles/Dashboard';
import DailyCashFlowChart from "../components/DailyCashFlowChart";
import SummaryCard from '../components/SummaryCard';
import apiService from '../services/apiService';
import { useState, useEffect } from 'react';
import CashFlowPieChart from '../components/CashFlowPieChart';
import ExpensePieChart from '../components/ExpensePieChart';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const [ total_expenses, setTotalExpenses ] = useState(0);
  const [ total_cash_flows, setTotalCF ] = useState(0);
  const [ which_is_higher, setHigher ] = useState(0);
  const [ difference, setDiff ] = useState(0);
  const [ cashFlowBreakdown, setCFBreakdown ] = useState([]);
  const [ expenseBreakdown, setExpBreakdown ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const response = await apiService.getDailyReports();
        setTotalExpenses(response.total_expenses);
        setTotalCF(response.total_cash_flows);
        setHigher(response.which_is_higher);
        setDiff(response.difference);
        setCFBreakdown(response.cash_flow_type_breakdown);
        setExpBreakdown(response.expense_type_breakdown);
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
      {token ? (
        <div>
            <CardWrapper>
              <SummaryCard title="Total Expenses" value={total_expenses} />
              <SummaryCard title="Total Cash Flows" value={total_cash_flows} />
              <SummaryCard title="Which is Higher" value={which_is_higher} />
              <SummaryCard title="Difference" value={difference} />
            </CardWrapper>
          
            <ChartsContainer>
              <div className="row">
                <div className="col">
                  <section>
                    <h3>Daily Cash Flows and Expenses Comparison</h3>
                    <DailyCashFlowChart />
                  </section>
                </div>
                <div className="col">
                  <section>
                    <h3>Expense Types Breakdown</h3>
                    <ExpensePieChart data={expenseBreakdown}/>
                  </section>
                </div>
                <div className="col">
                  <section>
                    <h3>Cash Flows Types Breakdown</h3>
                    <CashFlowPieChart data={cashFlowBreakdown}/>
                  </section>
                </div>
              </div>
            </ChartsContainer>
        </div>
      ) : (
        <LoginMessage>Login to view Dashboard content.</LoginMessage>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
