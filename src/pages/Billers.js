import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillersTable from '../components/BillersTable';
import FlashMessage from '../components/FlashMessage'; 
import { FormRow, FormWrapper, SubmitButton, PageContainer, ContentContainer, Header, AddButton, Label, InputField } from '../styles/BillersStyles';
import { AmountTypeDropdown, BillerTypeDropdown } from '../components/Dropdowns';
import apiService from '../services/apiService';

const BillersPage = ({ sidebarOpen }) => {
  const [totalItems, setTotalItems] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageLimit, setCurrentPageLimit] = useState(10);
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [showForm, setShowForm] = useState(false); 
  const [formData, setFormData] = useState({
    biller_name: '',
    biller_type: '',
    custom_type: '',
    amount: '',
    amount_type: '',
    usual_due_date_day: '',
    remarks: '',
  });

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const handleFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage('');
    }, 3000);
  };
  
  useEffect(() => {
    const fetchBillers = async () => {
      const result = await apiService.getBillers(currentPage, currentPageLimit);
      setTotalItems(result.data.total_items || 0);
      setTotalPages(result.data.total_pages || 0);
    }
    
    fetchBillers();
  }, [currentPage, currentPageLimit]); // Fetch data when page or page limit changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageLimitChange = (newLimit) => {
    setCurrentPageLimit(newLimit);
  };

  const handleAddBiller = async (e) => {
    e.preventDefault();
    const billerData = {
      biller_name: formData.biller_name,
      biller_type: formData.biller_type,
      custom_type: formData.custom_type,
      amount: formData.amount,
      amount_type: formData.amount_type,
      usual_due_date_day: formData.usual_due_date_day,
      remarks: formData.remarks,
    };
    if (formData.usual_due_date_day === '') {
      delete billerData.usual_due_date_day;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(billerData),
      });
      const result = await response.json();
  
      if (response.ok) {
        handleFlashMessage(result.message);
        refreshData();
        setTimeout(() => navigate("/billers"), 2000);
      } else {
        const errorDetail = result.response?.detail || 'Something went wrong';
        console.error('Error:', errorDetail);
        handleFlashMessage(`Error: ${errorDetail}`);
      }
    } catch (error) {
      console.error('Error adding biller:', error);
      handleFlashMessage('An error occurred while adding the biller.');
    }
  
    setFormData({
      biller_name: '',
      biller_type: '',
      custom_type: '',
      amount: '',
      amount_type: '',
      usual_due_date_day: '',
      remarks: '',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <PageContainer>
      <ContentContainer sidebarOpen={sidebarOpen}>
        <Header>
          <h1>Manage Billers</h1>
          <AddButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Biller'}
          </AddButton>
        </Header>
        <div>
            <Label>Total Billers: {totalItems}</Label>
            <Label>Total Pages: {totalPages}</Label>
        </div>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <BillersTable 
          handleFlashMessage={handleFlashMessage}
          refreshKey={refreshKey}
          currentPage={currentPage}
          currentPageLimit={currentPageLimit}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
        {showForm && (
          <FormWrapper onSubmit={handleAddBiller}>
            <h3>Add New Biller*</h3>
            <FormRow>
              <label htmlFor="biller_name">Biller Name*</label>
              <input
                id="biller_name"
                name="biller_name"
                value={formData.biller_name || ''}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="biller_type">Biller Type*</label>
              <BillerTypeDropdown
                value={formData.biller_type}
                onChange={(e) => handleChange(e)}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="custom_type">Custom Type</label>
              <input
                id="custom_type"
                name="custom_type"
                value={formData.custom_type || ''}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="amount">Amount*</label>
              <input
                id="amount"
                name="amount"
                type='number'
                value={formData.amount || ''}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="usual_due_date_day">Usual Due Date Day</label>
              <input
                id="usual_due_date_day"
                name="usual_due_date_day"
                type='number'
                value={formData.usual_due_date_day || ''}
                onChange={handleChange}
              />
            </FormRow>             
            <FormRow>
              <label htmlFor="amount_type">Amount Type*</label>
              <AmountTypeDropdown
                value={formData.amount_type}
                onChange={(e) => handleChange(e)}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks || ''}
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

export default BillersPage;
