// import React, { useState } from 'react';
// import BillersTable from '../components/BillersTable';
// import styled from 'styled-components';
// import FlashMessage from '../components/FlashMessage'; // Import FlashMessage component

// const PageContainer = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const ContentContainer = styled.div`
//   flex-grow: 1;
//   padding: 20px;
//   margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '250px' : '0')}; /* Adjust for sidebar */
//   transition: margin-left 0.3s ease-in-out;
// `;

// const BillersPage = ({ sidebarOpen }) => {
//   // Local state to manage flash messages
//   const [flashMessage, setFlashMessage] = useState('');

//   // Function to set flash message
//   const handleFlashMessage = (message) => {
//     setFlashMessage(message);

//     // Automatically hide the message after 3 seconds (for example)
//     setTimeout(() => {
//       setFlashMessage('');
//     }, 3000);
//   };

//   return (
//     <PageContainer>
//       <ContentContainer sidebarOpen={sidebarOpen}>
//         <h1>Manage Billers</h1>
//         {flashMessage && <FlashMessage message={flashMessage} />} {/* Display flash message if it exists */}
//         <BillersTable handleFlashMessage={handleFlashMessage} />
//       </ContentContainer>
//     </PageContainer>
//   );
// };

// export default BillersPage;

import React, { useState, useEffect } from 'react';
import BillersTable from '../components/BillersTable';
import FlashMessage from '../components/FlashMessage';
import { FormRow, FormWrapper, SubmitButton, PageContainer, ContentContainer, Header, AddButton } from '../styles/Billers'
import { AmountTypeDropdown, BillerTypeDropdown } from '../components/BillersDropdowns';

const BillersPage = ({ sidebarOpen }) => {
  const [flashMessage, setFlashMessage] = useState('');
  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
  const [formData, setFormData] = useState({
    biller_name: '',
    biller_type: '',
    custom_type: '',
    amount: '',
    amount_type: '',
    usual_due_date_day: '',
    remarks: '',
  });

  const handleFlashMessage = (message) => {
    setFlashMessage(message);

    setTimeout(() => {
      setFlashMessage('');
    }, 3000);
  };

  const handleAddBiller = async (e) => {
    e.preventDefault();
  
    // Prepare the form data to be sent to the backend
    const billerData = {
      biller_name: formData.biller_name,
      biller_type: formData.biller_type,
      custom_type: formData.custom_type,
      amount: formData.amount,
      amount_type: formData.amount_type,
      remarks: formData.remarks,
    };

    if (formData.usual_due_date_day === '') {
      delete billerData.usual_due_date_day;
    }
  
    try {
      // Make the POST request to add the new biller
      const response = await fetch(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(billerData), // Send the form data as JSON
      });

      const result = await response.json();
  
      if (response.ok) {
        // Success - Handle the response from FastAPI
        console.log('New biller added:', result.response);
        handleFlashMessage(result.response.message); // Display the success message
      } else {
        // Error - Handle error response from FastAPI
        const errorDetail = result.response?.detail || 'Something went wrong';
        console.error('Error:', errorDetail);
        handleFlashMessage(`Error: ${errorDetail}`);
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Error adding biller:', error);
      handleFlashMessage('An error occurred while adding the biller.');
    }
  
    // Clear the form data after submission
    setFormData({
      biller_name: '',
      biller_type: '',
      custom_type: '',
      amount: '',
      amount_type: '',
      usual_due_date_day: '',
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
          <h1>Manage Billers</h1>
          <AddButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Biller'}
          </AddButton>
        </Header>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <BillersTable handleFlashMessage={handleFlashMessage} />
        {showForm && (
          <FormWrapper onSubmit={handleAddBiller}>
            <h3>Add New Biller</h3>
            <FormRow>
              <label htmlFor="biller_name">Biller Name</label>
              <input
                id="biller_name"
                name="biller_name"
                value={formData.biller_name || ''}
                onChange={handleChange}
              />
            </FormRow>
            {/* {[
              { label: 'Biller Name', name: 'biller_name', type: 'text' },
              { label: 'Custom Type', name: 'custom_type', type: 'text' },
              { label: 'Amount', name: 'amount', type: 'number' },
              {
                label: 'Usual Due Date Day',
                name: 'usual_due_date_day',
                type: 'number',
              },
            ].map(({ label, name, type }) => (
              <FormRow key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name] || ''}
                  onChange={handleChange}
                />
              </FormRow>
            ))} */}
            <FormRow>
              <label htmlFor="biller_type">Biller Type</label>
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
              <label htmlFor="amount">Amount</label>
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
              <label htmlFor="amount_type">Amount Type</label>
              <AmountTypeDropdown
                value={formData.amount_type}
                onChange={(e) => handleChange(e)}
              />
            </FormRow>
            {/* Remarks field */}
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
