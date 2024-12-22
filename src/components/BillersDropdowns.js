import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Create a styled wrapper for the form and dropdowns
export const DropdownWrapper = styled.div`
  .form-select {
    background-color: #f8f9fa;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }

  .form-select:focus {
    background-color: #fff;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.25rem rgba(38, 143, 255, 0.25);
  }
`;

export const AmountTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchAmountTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOptions(response.data.response.amount_types);
      } catch (error) {
        console.error("Error fetching amount types:", error);
      }
    };

    fetchAmountTypes();
  }, []);

  return (
    <DropdownWrapper>
      <select
        name="amount_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Amount Type</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
          </option>
        ))}
      </select>
    </DropdownWrapper>
  );
};

export const BillerTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchBillerTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOptions(response.data.response.biller_types);
      } catch (error) {
        console.error("Error fetching biller types:", error);
      }
    };

    fetchBillerTypes();
  }, []);

  return (
    <DropdownWrapper>
      <select
        name="biller_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Biller Type</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
          </option>
        ))}
      </select>
    </DropdownWrapper>
  );
};
