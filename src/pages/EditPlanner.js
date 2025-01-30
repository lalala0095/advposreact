import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormWrapper, FormRow, Label, TextArea, SubmitButton, PageContainer, ContentContainer, CancelButton } from "../styles/BillersStyles";
import { PlannerPlatformDropdown, PlannerTypeDropdown } from "../components/Dropdowns";
import FlashMessage from "../components/FlashMessage";
import usePlanners from "../hooks/usePlanners";
import apiService from "../services/apiService";

const EditPlannerPage = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { plannerId } = useParams();
  const { planners, loading, error } = usePlanners(1); // Assuming usePlanners hook fetches planners
  const navigate = useNavigate();
  const [ renderer, reRender ] = useState(1);
  const [plannerData, setPlannerData] = useState(null);

  const [formData, setFormData] = useState({
    date_of_transaction: "",
    description: "",
    planner_type: "",
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
    navigate('/planners');
  };

  // Set the planner data when fetched
  useEffect(() => {
    if (plannerId && planners.length > 0) {
      const selectedPlanner = planners.find(planner => planner._id === plannerId);
      setPlannerData(selectedPlanner);
    }
  }, [plannerId, planners]);

  // Set formData when plannerData is available
  useEffect(() => {
    if (plannerData) {
      setFormData({
        date_of_transaction: plannerData.date_of_transaction,
        description: plannerData.description,
        planner_type: plannerData.planner_type,
        amount: plannerData.amount,
        platform: plannerData.platform,
        store: plannerData.store,
        remarks: plannerData.remarks,
        payment_method: plannerData.payment_method,
      });
    }
  }, [plannerData]);

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
  
      const result = await apiService.putPlanner(plannerId, payload);
      handleFlashMessage(result.data.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/planners");
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
  if (error) return <div>Error loading planners data</div>;

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <FormWrapper>
          <h2 className="text-center mb-4">Edit Planner</h2>
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
              <Label htmlFor="store">Store</Label>
              <input
                id="store"
                name="store"
                value={formData.store}
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
            <FormRow>
              <Label htmlFor="payment_method">Payment Method</Label>
              <input
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
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

export default EditPlannerPage;
