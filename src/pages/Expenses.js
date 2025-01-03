import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpensesTable from '../components/ExpensesTable';
import FlashMessage from '../components/FlashMessage'; 
import { FormRow, FormWrapper, SubmitButton, PageContainer, ContentContainer, Header, AddButton, Label } from '../styles/BillersStyles';
import { ExpensePlatformDropdown, ExpenseTypeDropdown } from '../components/Dropdowns';
import apiService from '../services/apiService';

const Expenses = ({ sidebarOpen }) => {
  const [totalItems, setTotalItems] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageLimit, setCurrentPageLimit] = useState(10);
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [showForm, setShowForm] = useState(false); 
  const [formData, setFormData] = useState({
    date_of_transaction: '',
    description: '',
    expense_type: '',
    amount: '',
    platform: '',
    store: '',
    remarks: '',
    payment_method: '',
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
    const fetchExpenses = async () => {
      const result = await apiService.getExpenses(currentPage, currentPageLimit);
      setTotalItems(result.data.total_items || 0);
      setTotalPages(result.data.total_pages || 0);
    }
    
    fetchExpenses();
  }, [currentPage, currentPageLimit]); // Fetch data when page or page limit changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageLimitChange = (newLimit) => {
    setCurrentPageLimit(newLimit);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const expenseData = {
      date_of_transaction: formData.date_of_transaction,
      description: formData.description,
      expense_type: formData.expense_type,
      amount: formData.amount,
      platform: formData.platform,
      store: formData.store,
      remarks: formData.remarks,
      payment_method: formData.payment_method,
    };
    if (formData.store === '') {
      delete expenseData.store;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_FASTAPI_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(expenseData),
      });
      const result = await response.json();
  
      if (response.ok) {
        handleFlashMessage(result.message);
        refreshData();
        setTimeout(() => navigate("/expenses"), 2000);
      } else {
        const errorDetail = result.response?.detail || 'Something went wrong';
        console.error('Error:', errorDetail);
        handleFlashMessage(`Error: ${errorDetail}`);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      handleFlashMessage('An error occurred while adding the expense.');
    }
  
    setFormData({
      date_of_transaction: '',
      description: '',
      expense_type: '',
      amount: '',
      platform: '',
      store: '',
      remarks: '',
      payment_method: '',
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
          <h1>Manage Expenses</h1>
          <AddButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Expense'}
          </AddButton>
        </Header>
        <div>
            <Label>Total Expenses: {totalItems}</Label>
            <Label>Total Pages: {totalPages}</Label>
        </div>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <ExpensesTable 
          handleFlashMessage={handleFlashMessage}
          refreshKey={refreshKey}
          currentPage={currentPage}
          currentPageLimit={currentPageLimit}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
        {showForm && (
          <FormWrapper onSubmit={handleAddExpense}>
            <h3>Add New Expense*</h3>
            <FormRow>
              <label htmlFor="date_of_transaction">Date of Transaction*</label>
              <input
                type='date'
                id="date_of_transaction"
                name="date_of_transaction"
                value={formData.date_of_transaction || ''}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="description">Description*</label>
              <input
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="expense_type">Expense Type*</label>
              <ExpenseTypeDropdown
                value={formData.expense_type}
                onChange={(e) => handleChange(e)}
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
              <label htmlFor="platform">Platform*</label>
              <ExpensePlatformDropdown
                value={formData.platform || ''}
                onChange={(e) => handleChange(e)}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="store">Store</label>
              <input
                id="store"
                name="store"
                value={formData.store || ''}
                onChange={handleChange}
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
            <FormRow>
              <label htmlFor="payment_method">Payment Method</label>
              <input
                id="payment_method"
                name="payment_method"
                value={formData.payment_method || ''}
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

export default Expenses;
