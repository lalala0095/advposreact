import React, { useEffect, useState } from "react";
import axios from "axios";
import { DropdownWrapper } from "../styles/BillersStyles";

export const AmountTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchAmountTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_options`, {
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

export const CashFlowTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchCashFlowTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_options`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOptions(response.data.response.cash_flow_types);
      } catch (error) {
        console.error("Error fetching cash_flow types:", error);
      }
    };

    fetchCashFlowTypes();
  }, []);

  return (
    <DropdownWrapper>
      <select
        name="cash_flow_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select CashFlow Type</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
          </option>
        ))}
      </select>
    </DropdownWrapper>
  );
};
