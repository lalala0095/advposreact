import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormWrapper, FormRow, Label, InputField, TextArea, SubmitButton, PageContainer, ContentContainer, DateInputField } from "../styles/BillersStyles";
import { CashFlowTypeDropdown } from "../components/Dropdowns";
import FlashMessage from "../components/FlashMessage";
import useCashFlows from "../hooks/useCashFlows";
import apiService from "../services/apiService";

const EditCashFlowPage = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { cash_flowId } = useParams();
  const [cashFlowData, setCashFlowData] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => setFlashMessage(''), 3000); // Clears the flash message after 3 seconds
  };

  // Fetch cash flow data
  useEffect(() => {
    const fetchCashFlowDetails = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCashFlow(cash_flowId);
        setCashFlowData(response.data); // Assuming response.data contains cash flow details
        handleFlashMessage('Successfully fetched cash flow data');
      } catch (error) {
        setError('Failed to fetch cash flow details');
        handleFlashMessage("Error fetching cash flow: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlowDetails();
  }, [cash_flowId]);

  // Update form data when cashFlowData is fetched
  useEffect(() => {
    if (cashFlowData) {
      setFormData({
        date_of_transaction: cashFlowData.date_of_transaction || '',
        cash_flow_name: cashFlowData.cash_flow_name || '',
        cash_flow_type: cashFlowData.cash_flow_type || '',
        custom_type: cashFlowData.custom_type || '',
        amount: cashFlowData.amount || '',
        payment_method: cashFlowData.payment_method || '',
        platform: cashFlowData.platform || '',
        remarks: cashFlowData.remarks || '',
      });
    }
  }, [cashFlowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let payload = { ...formData };
      const result = await apiService.updateCashFlow(cash_flowId, payload, token);
      handleFlashMessage(result.data.response.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/cash_flows");
      }, 2000);
    } catch (error) {
      handleFlashMessage("Error: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <FormWrapper>
          <h2 className="text-center mb-4">Edit CashFlow</h2>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <Label htmlFor="date_of_transaction">Date of Transaction</Label>
              <DateInputField
                name="date_of_transaction"
                value={formData.date_of_transaction}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="cash_flow_name">Cash Flow Name</Label>
              <InputField
                name="cash_flow_name"
                value={formData.cash_flow_name}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="cash_flow_type">Cash Flow Type</Label>
              <CashFlowTypeDropdown
                name="cash_flow_type"
                value={formData.cash_flow_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="custom_type">Custom Type</Label>
              <InputField
                name="custom_type"
                value={formData.custom_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="amount">Amount</Label>
              <InputField
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                type="number"
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="payment_method">Payment Method</Label>
              <InputField
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="platform">Platform</Label>
              <InputField
                name="platform"
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
            <SubmitButton type="submit">Save Changes</SubmitButton>
          </form>
        </FormWrapper>
      </ContentContainer>
    </PageContainer>
  );
};

export default EditCashFlowPage;
