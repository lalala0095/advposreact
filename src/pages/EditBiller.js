// EditBiller.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormWrapper, FormRow, Label, InputField, TextArea, SubmitButton } from "../styles/Billers"; // Import shared styles
import { AmountTypeDropdown, BillerTypeDropdown } from "../components/BillersDropdowns";

const EditBillerPage = () => {
  const { billerId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date_added: "",
    biller_name: "",
    biller_type: "",
    amount_type: "",
    amount: "",
    custom_type: "",
    usual_due_date_day: "",
    remarks: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBiller = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_FASTAPI_URL}/billers/get_biller/${billerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData(response.data.response.item);
      } catch (error) {
        console.error("Error fetching biller details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBiller();
  }, [billerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = { ...formData, date_added: formData.date_added || "" };

      await axios.put(
        `${process.env.REACT_APP_FASTAPI_URL}/billers/${billerId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/billers", { state: { message: "Biller updated successfully" } });
    } catch (error) {
      console.error("Error updating biller:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
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
          <AmountTypeDropdown value={formData.amount_type} onChange={handleChange} />
        </FormRow>
        <FormRow>
          <Label htmlFor="biller_type">Biller Type</Label>
          <BillerTypeDropdown value={formData.biller_type} onChange={handleChange} />
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
  );
};

export default EditBillerPage;
