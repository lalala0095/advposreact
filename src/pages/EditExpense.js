import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormWrapper, FormRow, Label, TextArea, SubmitButton, PageContainer, ContentContainer, CancelButton } from "../styles/BillersStyles";
import { ExpensePlatformDropdown, ExpenseTypeDropdown } from "../components/Dropdowns";
import FlashMessage from "../components/FlashMessage";
import useExpenses from "../hooks/useExpenses";
import apiService from "../services/apiService";

const EditExpensePage = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { expenseId } = useParams();
  const { expenses, loading, error } = useExpenses(1); // Assuming useExpenses hook fetches expenses
  const navigate = useNavigate();
  const [ renderer, reRender ] = useState(1);
  const [expenseData, setExpenseData] = useState(null);

  const [formData, setFormData] = useState({
    date_of_transaction: "",
    description: "",
    expense_type: "",
    amount: "",
    platform: "",
    store: "",
    remarks: "",
    payment_method: "",
  });

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  // Set the expense data when fetched
  useEffect(() => {
    if (expenseId && expenses.length > 0) {
      const selectedExpense = expenses.find(expense => expense._id === expenseId);
      setExpenseData(selectedExpense);
    }
  }, [expenseId, expenses]);

  // Set formData when expenseData is available
  useEffect(() => {
    if (expenseData) {
      setFormData({
        date_of_transaction: expenseData.date_of_transaction,
        description: expenseData.description,
        expense_type: expenseData.expense_type,
        amount: expenseData.amount,
        platform: expenseData.platform,
        store: expenseData.store,
        remarks: expenseData.remarks,
        payment_method: expenseData.payment_method,
      });
    }
  }, [expenseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage('');
    try {
      let payload = { ...formData };
  
      // Remove store from payload if it's not provided
      // if (!payload.store) {
      //   delete payload.store;
      // }
  
      const result = await apiService.putExpense(expenseId, payload);
      handleFlashMessage(result.data.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/expenses");
      }, 2000);
    } catch (error) {
      // Log the error message for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
        handleFlashMessage(error.response.data.detail);
      } else {
        console.error("Error:", error.message);
        handleFlashMessage(error.message);
      }

      reRender((prev) => prev + 1)
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading expenses data</div>;

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <FormWrapper>
          <h2 className="text-center mb-4">Edit Expense</h2>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <Label htmlFor="date_of_transaction">Date of Transaction</Label>
              <input
                id="date_of_transaction"
                name="date_of_transaction"
                type="date"
                value={formData.date_of_transaction}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="description">Description</Label>
              <input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="amount">Amount</Label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="expense_type">Expense Type</Label>
              <ExpenseTypeDropdown
                value={formData.expense_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="platform">Platform</Label>
              <ExpensePlatformDropdown
                value={formData.platform}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="store">Store</Label>
              <input
                id="store"
                name="store"
                value={formData.store}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="payment_method">Payment Method</Label>
              <input
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
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
            <SubmitButton type="submit" onClick={handleSubmit}>Save Changes</SubmitButton>
            <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
          </form>
        </FormWrapper>
      </ContentContainer>
    </PageContainer>
  );
};

export default EditExpensePage;
