import React, { useEffect, useState } from "react";
import axios from "axios";
import { DropdownWrapper } from "../styles/BillersStyles";

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
