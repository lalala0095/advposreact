// pages/CashFlowsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CashFlowsTable from '../components/CashFlowsTable';
import FlashMessage from '../components/FlashMessage'; // Import the new FlashMessage component
import { FormRow, FormWrapper, SubmitButton, PageContainer, ContentContainer, Header, AddButton, InputField, Label, TextArea, DateInputField } from '../styles/BillersStyles'
import { CashFlowTypeDropdown } from '../components/Dropdowns';
import apiService from '../services/apiService';

const CashFlowsPage = ({ sidebarOpen }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageLimit, setCurrentPageLimit] = useState(10);
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

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage(''); // Clear the message after a delay
    }, 3000);
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
        // Trigger success message
        handleFlashMessage(result.message);
        refreshData();
        setTimeout(() => navigate("/cash_flows"), 2000);
        // Trigger CashFlowsTable refresh
        const table = document.querySelector('.cash_flows-table'); // Assuming a class name
        if (table) {
          table.refreshData(); // Custom method for fetching updated data
        }
      
        // Navigate or update state
        setTimeout(() => {
          navigate("/cash_flows");
        }, 2000);
      } else {
        // Error - Handle error response from FastAPI
        const errorDetail = result.response?.detail || 'Something went wrong';
        console.error('Error:', errorDetail);
        handleFlashMessage(`Error: ${errorDetail}`);
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Error adding cash_flow:', error);
      handleFlashMessage('An error occurred while adding the cash_flow.');
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageLimitChange = (newLimit) => {
    setCurrentPageLimit(newLimit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (cash_flowId) => {
    const response = await apiService.deleteCashFlow(cash_flowId);
    try {
        handleFlashMessage(response.data.message + " Refreshing the page.");
        setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error(error);
      handleFlashMessage(response.detail + " Refreshing the page.");
    }
  };

  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <Header>
          <h1>Manage Cash Flows</h1>
          <AddButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New CashFlow'}
          </AddButton>
        </Header>
        {flashMessage && <FlashMessage message={flashMessage} />} {/* Use the FlashMessage component here */}
        <CashFlowsTable 
          handleFlashMessage={handleFlashMessage}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          handleDelete={handleDelete}
          currentPage={currentPage}
          currentPageLimit={currentPageLimit}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}        
        />
        {showForm && (
          <FormWrapper onSubmit={handleAddCashFlow} className='cash-flows-form-wrapper'>
            <h3>Add New Cash Flow*</h3>
            <FormRow>
              <Label htmlFor="date_of_transaction">Date of Transaction</Label>
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
            <SubmitButton type="submit">Save</SubmitButton>
          </FormWrapper>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default CashFlowsPage;
