import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormWrapper, FormRow, Label, InputField, TextArea, SubmitButton, PageContainer, ContentContainer } from "../styles/BillersStyles";
import { AmountTypeDropdown, BillerTypeDropdown } from "../components/Dropdowns";
import FlashMessage from "../components/FlashMessage";
import useBillers from "../hooks/useBillers";

const EditBillerPage = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const { billerId } = useParams();
  const { billers, loading, error } = useBillers(1); // Assuming useBillers hook fetches billers
  const navigate = useNavigate();

  const [billerData, setBillerData] = useState(null);

  const [formData, setFormData] = useState({
    biller_name: "",
    biller_type: "",
    amount_type: "",
    amount: "",
    custom_type: "",
    usual_due_date_day: "",
    remarks: "",
  });

  const handleFlashMessage = (message) => {
    setFlashMessage(message);
  };

  // Set the biller data when fetched
  useEffect(() => {
    if (billerId && billers.length > 0) {
      const selectedBiller = billers.find(biller => biller._id === billerId);
      setBillerData(selectedBiller);
    }
  }, [billerId, billers]);

  // Set formData when billerData is available
  useEffect(() => {
    if (billerData) {
      setFormData({
        biller_name: billerData.biller_name,
        biller_type: billerData.biller_type,
        amount_type: billerData.amount_type,
        amount: billerData.amount,
        usual_due_date_day: billerData.usual_due_date_day,
        remarks: billerData.remarks,
      });
    }
  }, [billerData]);

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
        `${process.env.REACT_APP_FASTAPI_URL}/billers/${billerId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleFlashMessage(result.data.data.message + " Redirecting. . .");
      setTimeout(() => {
        navigate("/billers");
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
  if (error) return <div>Error loading billers data</div>;

  return (
    <PageContainer>
      <ContentContainer>
        {flashMessage && <FlashMessage message={flashMessage} />}
        <FormWrapper>
          <h2 className="text-center mb-4">Edit Biller</h2>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Biller Name", name: "biller_name", type: "text" },
              { label: "Amount", name: "amount", type: "number" },
              { label: "Usual Due Date Day", name: "usual_due_date_day", type: "number" },
            ].map(({ label, name, type }) => (
              <FormRow key={name}>
                <Label htmlFor={name}>{label}:</Label>
                <InputField
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                />
              </FormRow>
            ))}
            <FormRow>
              <Label htmlFor="amount_type">Amount Type</Label>
              <AmountTypeDropdown
                value={formData.amount_type}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="biller_type">Biller Type</Label>
              <BillerTypeDropdown
                value={formData.biller_type}
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

export default EditBillerPage;
