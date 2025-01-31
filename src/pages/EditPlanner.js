import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlannerFormWrapper, FormRow, Label, InputField, SubmitButton, PageContainer, ContentContainer, CancelButton } from "../styles/BillersStyles";
import FlashMessage from "../components/FlashMessage";
import apiService from "../services/apiService";

const EditPlannerPage = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { plannerId } = useParams();
  const navigate = useNavigate();

  const [plannerData, setPlannerData] = useState(null);
  const [formData, setFormData] = useState({
    planner_name: "",
    expenses: [],
    cash_flows: [],
  });
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedCashFlows, setSelectedCashFlows] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allCashFlows, setAllCashFlows] = useState([]);

  const handleCancel = () => {
    navigate('/planners');
  };

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
  };

  // Fetch all available expenses and cash flows
  useEffect(() => {
    const fetchPlannersOptions = async () => {
      try {
        const result = await apiService.getPlannersOptions();
        setAllExpenses(result.expenses || []);
        setAllCashFlows(result.cash_flows || []);
      } catch (error) {
        handleFlashMessage('Error fetching available expenses and cash flows');
        console.error(error);
      }
    };

    fetchPlannersOptions();
  }, []);

  // Fetch planner data when plannerId is available
  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const result = await apiService.getPlanner(plannerId);
        if (result.planner) {
          setPlannerData(result.planner);
          setFormData({
            planner_name: result.planner.planner_name,
          });
          setSelectedExpenses(result.planner.expenses || []);
          setSelectedCashFlows(result.planner.cash_flows || []);
        }
      } catch (error) {
        handleFlashMessage('Error fetching planner data');
        console.error(error);
      }
    };

    fetchPlannerData();
  }, [plannerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectExpense = (expense) => {
    setSelectedExpenses((prevExpenses) => {
      if (prevExpenses.some((item) => item._id === expense._id)) {
        return prevExpenses.filter((item) => item._id !== expense._id);
      }
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

  const totalExpenses = selectedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCashFlows = selectedCashFlows.reduce((sum, cashFlow) => sum + cashFlow.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const plannerData = {
      planner_name: formData.planner_name,
      expenses: selectedExpenses,
      cash_flows: selectedCashFlows,
    };

  
    try {
      const result = await apiService.putPlanner(plannerData, plannerId);
      handleFlashMessage(result.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/planners");
      }, 2000);
    } catch (error) {
      console.error("Error updating planner:", error);
      handleFlashMessage("An error occurred while updating the planner.");
    }
  };

  if (!plannerData || !allExpenses || !allCashFlows) return <div>Loading...</div>;  // Show loading until planner data is fetched

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <PlannerFormWrapper onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Edit Planner</h2>
            <FormRow>
              <Label htmlFor="planner_name">Planner Name</Label>
              <InputField
                type="text"
                name="planner_name"
                value={formData.planner_name || ""}
                onChange={handleChange}
              />
            </FormRow>

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
                {allExpenses.map((expense, index) => (
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

            <div style={{ marginTop: '20px' }}>
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
                {allCashFlows.map((cashFlow, index) => (
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

            <SubmitButton type="submit">Save Changes</SubmitButton>
            <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
        </PlannerFormWrapper>
      </ContentContainer>
    </PageContainer>
  );
};

export default EditPlannerPage;
