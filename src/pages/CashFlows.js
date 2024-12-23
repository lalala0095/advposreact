// pages/CashFlowsPage.js
import React, { useState } from 'react';
import CashFlowsTable from '../components/CashFlowsTable';
import FlashMessage from '../components/FlashMessage'; // Import the new FlashMessage component
import { FormRow, FormWrapper, SubmitButton, PageContainer, ContentContainer, Header, AddButton, Label, InputField, TextArea, DateInputField } from '../styles/BillersStyles'
import { CashFlowTypeDropdown } from '../components/CashFlowsDropdowns';
import useCashFlows from '../hooks/useCashFlows';
import { useNavigate } from 'react-router-dom';

const CashFlowsPage = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date_of_transaction: '',
    cash_flow_name: '',
    cash_flow_type: '',
    custom_type: '',
    amount: '',
    platform: '',
    payment_method: '',
    remarks: '',
  });

  const { cash_flows, totalPages, loading, error, refreshData } = useCashFlows(1);

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
  };

  const handleAddCashFlow = async (e) => {
    e.preventDefault();
  
    // Prepare the form data to be sent to the backend
    const cash_flowData = {
      date_of_transaction: formData.date_of_transaction,
      cash_flow_name: formData.cash_flow_name,
      cash_flow_type: formData.cash_flow_type,
      custom_type: formData.custom_type,
      amount: formData.amount,
      payment_method: formData.payment_method,
      platform: formData.platform,
      remarks: formData.remarks,
    };
  
    if (formData.usual_due_date_day === '') {
      delete cash_flowData.usual_due_date_day;
    }
  
    try {
      // Make the POST request to add the new cash_flow
      const response = await fetch(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(cash_flowData),
      });
      const result = await response.json();
  
      if (response.ok) {
        // Success - Handle the response from FastAPI
        handleFlashMessage(result.message + ". Please wait for the data refresh.");
        setFormData({
          date_of_transaction: '',
          cash_flow_name: '',
          cash_flow_type: '',
          custom_type: '',
          amount: '',
          platform: '',
          payment_method: '',
          remarks: '',
        });
        setShowForm(false);
        setTimeout(() => {
          console.log("refreshing data");
          refreshData();
          // <ForceRerender />
          console.log("navigating");
          navigate("/cash_flows");
          // window.location.href = "/cash_flows"; 
        }, 1000);
        // navigate("/cash_flows");
      } else {
        // Error - Handle error response from FastAPI
        const errorDetail = result?.detail || 'Something went wrong';
        
        // If FastAPI returns a list of validation errors, display them
        if (Array.isArray(errorDetail)) {
          const errorMessages = errorDetail.map((err) => `${err.loc.join('.')} - ${err.msg}`).join(', ');
          handleFlashMessage(`Validation Errors: ${errorMessages}`);
        } else {
          handleFlashMessage(`Error: ${errorDetail}`);
        }
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Error adding cash_flow:', error);
      handleFlashMessage('An unexpected error occurred while adding the cash flow.');
    }
  
    // Clear the form data after submission
    setFormData({
      date_of_transaction: '',
      cash_flow_name: '',
      cash_flow_type: '',
      custom_type: '',
      amount: '',
      platform: '',
      payment_method: '',
      amount_type: '',
      remarks: '',
    });
    setShowForm(false); // Hide the form after submission
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <Header>
          <h1>Manage Cash Flows</h1>
          <AddButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Cash Flow'}
          </AddButton>
        </Header>
        {flashMessage && <FlashMessage message={flashMessage} />}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <CashFlowsTable cashFlows={cash_flows} totalPages={totalPages} handleFlashMessage={handleFlashMessage} />
        {showForm && (
        <FormWrapper>
          <h2 className="text-center mb-4">Add Cash Flow</h2>
          <form onSubmit={handleAddCashFlow}>
            <FormRow>
              <Label htmlFor="date_of_transaction">Cash Flow Type</Label>
              <DateInputField
                name='date_of_transaction'
                value={formData.date_of_transaction}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="cash_flow_name">Cash Flow Name</Label>
              <InputField
                name='cash_flow_name'
                value={formData.cash_flow_name}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="cash_flow_type">Cash Flow Type</Label>
              <CashFlowTypeDropdown
                name='cash_flow_type'
                value={formData.cash_flow_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="custom_type">Custom Type</Label>
              <InputField
                name='custom_type'
                value={formData.custom_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="amount">Amount</Label>
              <InputField
                name='amount'
                value={formData.amount}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="payment_method">Payment Method</Label>
              <InputField
                name='payment_method'
                value={formData.payment_method}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="platform">Platform</Label>
              <InputField
                name='platform'
                value={formData.platform}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="remarks">Remarks</Label>
              <TextArea
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
              />
            </FormRow>
            <SubmitButton type="submit" onClick={handleAddCashFlow}>Save Changes</SubmitButton>
          </form>
        </FormWrapper>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default CashFlowsPage;
