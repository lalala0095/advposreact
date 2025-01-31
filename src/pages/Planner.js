import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlannersTable from '../components/PlannersTable';
import FlashMessage from '../components/FlashMessage'; 
import apiService from '../services/apiService';
import {
  PageContainer, ContentContainer, Header, AddButton, Label,
  PlannerFormWrapper, FormRow, SubmitButton
} from '../styles/BillersStyles';
import ViewComparison from '../components/ViewComparison';

const Planners = ({ sidebarOpen }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageLimit, setCurrentPageLimit] = useState(10);
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    planner_name: '',
    expenses: [],
    cash_flows: [],
  });

  const [expenses, setExpenses] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedCashFlows, setSelectedCashFlows] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [plannerData, setPlannerData] = useState(null);

  // Function to toggle the visibility of comparison and fetch planner data
  const toggleComparison = async (plannerId) => {
    setShowComparison((prevState) => !prevState);  // Toggle visibility
    try {
      const result = await apiService.getPlanner(plannerId);  // Fetch planner data
      setPlannerData(result);  // Set the planner data for comparison
      console.log("planner data: " + result);
    } catch (error) {
      console.error('Error fetching planner data:', error);
    }
  };

  useEffect(() => {
    const fetchPlanners = async () => {
      const result = await apiService.getPlanners(currentPage, currentPageLimit);
      setTotalItems(result.total_items || 0);
      setTotalPages(result.total_pages || 0);
    };
    fetchPlanners();
  }, [currentPage, currentPageLimit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageLimitChange = (newLimit) => {
    setCurrentPageLimit(newLimit);
  };

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage('');
    }, 3000);
  };

  const handleAddPlannerClick = async () => {
    setShowForm(!showForm);

    if (!showForm) {
      try {
        const result = await apiService.getPlannersOptions();
        setExpenses(result.planner.expenses || []);
        setCashFlows(result.planner.cash_flows || []);
      } catch (error) {
        console.error('Error fetching expenses & cash flows:', error);
        handleFlashMessage('Error loading options.');
      }
    }
  };

  const handleSelectExpense = (expense) => {
    setSelectedExpenses((prevExpenses) => {
      // If the expense is already selected, remove it
      if (prevExpenses.some((item) => item._id === expense._id)) {
        return prevExpenses.filter((item) => item._id !== expense._id);
      } 
      // Otherwise, add it
      return [...prevExpenses, expense];
    });
  };

  const handleSelectCashFlow = (cashFlow) => {
    setSelectedCashFlows((prevCashFlows) => {
      if (prevCashFlows.some((item) => item._id === cashFlow._id)) {
        return prevCashFlows.filter((item) => item._id !== cashFlow._id);
      }
      return [...prevCashFlows, cashFlow];
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  }

  const totalExpenses = selectedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCashFlows = selectedCashFlows.reduce((sum, cashFlow) => sum + cashFlow.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    const plannerData = {
      planner_name: formData.planner_name,
      expenses: selectedExpenses,
      cash_flows: selectedCashFlows,
    };
  
    try {
      const response = await apiService.postPlanners(plannerData);
      const result = await response.json();
  
      if (response.ok) {
        handleFlashMessage(result.message);
        setFormData({ planner_name: '', expenses: [], cash_flows: [] });
        setSelectedExpenses([]);
        setSelectedCashFlows([]);
        setShowForm(false);
        handleRefresh();
      } else {
        handleFlashMessage(`Error: ${result.detail || 'Failed to save planner'}`);
      }
    } catch (error) {
      console.error('Error submitting planner:', error);
      handleFlashMessage('An error occurred while saving the planner.');
    }
  };

  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <Header>
          <h1>Manage Planners</h1>
          <AddButton onClick={handleAddPlannerClick}>
            {showForm ? 'Cancel' : 'Add New Planner'}
          </AddButton>
        </Header>

        <div>
          <Label>Total Planners: {totalItems}</Label>
          <Label>Total Pages: {totalPages}</Label>
        </div>

        {flashMessage && <FlashMessage message={flashMessage} />}

        <PlannersTable 
          handleFlashMessage={handleFlashMessage}
          refreshKey={refreshKey}
          currentPage={currentPage}
          currentPageLimit={currentPageLimit}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
          toggleComparison={toggleComparison}
        />

        {showForm && (
          <PlannerFormWrapper onSubmit={handleSubmit}>
            <h3>Add New Planner</h3>

            <FormRow>
              <label htmlFor="planner_name">Planner Name*</label>
              <input
                id="planner_name"
                name="planner_name"
                value={formData.planner_name || ''}
                onChange={(e) => setFormData({ ...formData, planner_name: e.target.value })}
              />
            </FormRow>

            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Left Side: Expenses and Cash Flows */}
              <div style={{ flex: 1 }}>
                {/* Expenses Table */}
                <h4>Expenses</h4>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedExpenses.some((item) => item._id === expense._id)}
                            onChange={() => handleSelectExpense(expense)}
                          />
                        </td>
                        <td>{expense.expense_label}</td>
                        <td>{expense.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Cash Flows Table */}
                <h4>Cash Flows</h4>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlows.map((cashFlow, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedCashFlows.some((item) => item._id === cashFlow._id)}
                            onChange={() => handleSelectCashFlow(cashFlow)}
                          />
                        </td>
                        <td>{cashFlow.cash_flow_label}</td>
                        <td>{cashFlow.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Side: Selected Expenses and Cash Flows */}
              <div style={{ flex: 1 }}>
                <h4>Selected Expenses</h4>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExpenses.map((expense, index) => (
                      <tr key={expense._id}>
                        <td>{expense.expense_label}</td>
                        <td>{expense.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>Total Expenses</strong></td>
                      <td><strong>{totalExpenses.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <h4>Selected Cash Flows</h4>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCashFlows.map((cashFlow, index) => (
                      <tr key={cashFlow._id}>
                        <td>{cashFlow.cash_flow_label}</td>
                        <td>{cashFlow.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>Total Cash Flows</strong></td>
                      <td><strong>{totalCashFlows.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <SubmitButton type="submit">Save</SubmitButton>
          </PlannerFormWrapper>
        )}

        <div>
              {/* Display the comparison section if visible */}
              {showComparison && plannerData && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Comparison for Planner: {plannerData.planner_name}</h3>
                  <ViewComparison plannerData={plannerData} />  {/* Show comparison data */}
                </div>
              )}

        </div>

      </ContentContainer>
    </PageContainer>
  );
};

export default Planners;
