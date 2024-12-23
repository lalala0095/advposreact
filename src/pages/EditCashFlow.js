import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormWrapper, FormRow, Label, InputField, TextArea, SubmitButton, PageContainer, ContentContainer } from "../styles/BillersStyles";
import { CashFlowTypeDropdown } from "../components/CashFlowsDropdowns";
import FlashMessage from "../components/FlashMessage";
import useCashFlows from "../hooks/useCashFlows";

const EditCashFlow = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { cash_flowId } = useParams();
  const { cash_flows, loading, error } = useCashFlows(1); // Assuming useCashFlows hook fetches cash_flows
  const navigate = useNavigate();

  const [cash_flowData, setCashFlowData] = useState(null);

  const [formData, setFormData] = useState({
    cash_flow_name: "",
    cash_flow_type: "",
    amount_type: "",
    amount: "",
    custom_type: "",
    usual_due_date_day: "",
    remarks: "",
  });

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
  };

  // Set the cash_flow data when fetched
  useEffect(() => {
    if (cash_flowId && cash_flows.length > 0) {
      const selectedCashFlow = cash_flows.find(cash_flow => cash_flow._id === cash_flowId);
      setCashFlowData(selectedCashFlow);
    }
  }, [cash_flowId, cash_flows]);

  // Set formData when cash_flowData is available
  useEffect(() => {
    if (cash_flowData) {
      setFormData({
        cash_flow_name: cash_flowData.cash_flow_name,
        cash_flow_type: cash_flowData.cash_flow_type,
        amount_type: cash_flowData.amount_type,
        amount: cash_flowData.amount,
        usual_due_date_day: cash_flowData.usual_due_date_day,
        remarks: cash_flowData.remarks,
      });
    }
  }, [cash_flowData]);

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
  
      // Remove usual_due_date_day from payload if it's not provided
      if (!payload.usual_due_date_day) {
        delete payload.usual_due_date_day;
      }
  
      const result = await axios.put(
        `${process.env.REACT_APP_FASTAPI_URL}/cash_flows/${cash_flowId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleFlashMessage(result.data.response.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/cash_flows");
      }, 2000);
    } catch (error) {
      // Log the error message for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading cash_flows data</div>;

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <FormWrapper>
          <h2 className="text-center mb-4">Edit CashFlow</h2>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <Label htmlFor="cash_flow_name">Cash Flow Name</Label>
              <InputField
                value={formData.cash_flow_name}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="cash_flow_type">Cash Flow Type</Label>
              <CashFlowTypeDropdown
                value={formData.cash_flow_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="custom_type">Custom Type</Label>
              <InputField
                value={formData.custom_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="amount">Amount</Label>
              <InputField
                value={formData.amount}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="platform">Platform</Label>
              <InputField
                value={formData.custom_type}
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
          </form>
        </FormWrapper>
      </ContentContainer>
    </PageContainer>
  );
};

export default EditCashFlow;
