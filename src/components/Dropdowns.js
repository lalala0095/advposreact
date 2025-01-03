import React, { useEffect, useState } from "react";
import { DropdownWrapper, SignupDropdownWrapper } from "../styles/BillersStyles";
import apiService from "../services/apiService";

export const AmountTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state

  useEffect(() => {
    const fetchAmountTypes = async () => {
      try {
        const response = await apiService.getAmountTypeOptions();
        console.log('Amount Types Response:', response);  // Log the response
        setOptions(response || []);  // Ensure fallback to empty array
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching amount types:", error);
        setLoading(false);
      }
    };
  
    fetchAmountTypes();
  }, []);

  if (loading) return <div>Loading Amount Types...</div>; // Loading state

  return (
    <DropdownWrapper>
      <select
        name="amount_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Amount Type</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
            </option>
          ))
        ) : (
          <option>No options available</option> // Fallback message if no options
        )}
      </select>
    </DropdownWrapper>
  );
};

export const BillerTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state

  useEffect(() => {
    const fetchBillerTypes = async () => {
      try {
        const response = await apiService.getBillerTypeOptions();
        console.log('Biller Types Response:', response);  // Log the response
        setOptions(response || []);  // Ensure fallback to empty array
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching biller types:", error);
        setLoading(false);
      }
    };
  
    fetchBillerTypes();
  }, []);

  if (loading) return <div>Loading Biller Types...</div>; // Loading state

  return (
    <DropdownWrapper>
      <select
        name="biller_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Biller Type</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
            </option>
          ))
        ) : (
          <option>No options available</option> // Fallback message if no options
        )}
      </select>
    </DropdownWrapper>
  );
};

export const CashFlowTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state

  useEffect(() => {
    const fetchCashFlowTypes = async () => {
      try {
        const response = await apiService.getCashFlowTypeOptions();
        setOptions(response || []); // Ensure fallback to empty array if data is undefined
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching cash_flow types:", error);
        setLoading(false);
      }
    };

    fetchCashFlowTypes();
  }, []);

  if (loading) return <div>Loading CashFlow Types...</div>; // Loading state

  return (
    <DropdownWrapper>
      <select
        name="cash_flow_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select CashFlow Type</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
            </option>
          ))
        ) : (
          <option>No options available</option> // Fallback message if no options
        )}
      </select>
    </DropdownWrapper>
  );
};

export const SubscriptionDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionTypes = async () => {
      try {
        const response = await apiService.getSubscriptionOptions();
        console.log('Subscription Types Response:', response);
        setOptions(response || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription types:", error);
        setLoading(false);
      }
    };

    fetchSubscriptionTypes();
  }, []);

  if (loading) return <div>Loading Subscription Types...</div>;

  return (
    <SignupDropdownWrapper>
      <select
        name="subscription"
        value={value || ""}
        onChange={onChange}
      >
        <option value="">Select Subscription Type</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))
        ) : (
          <option>No options available</option>
        )}
      </select>
    </SignupDropdownWrapper>
  );
};


export const ExpenseTypeDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const response = await apiService.getExpensesOptions();
        console.log('Expense Types Response:', response);
        setOptions(response.expense_types || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expense types:", error);
        setLoading(false);
      }
    };
  
    fetchExpenseTypes();
  }, []);

  if (loading) return <div>Loading Expense Types...</div>; // Loading state

  return (
    <DropdownWrapper>
      <select
        name="expense_type"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Expense Type</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
            </option>
          ))
        ) : (
          <option>No options available</option> // Fallback message if no options
        )}
      </select>
    </DropdownWrapper>
  );
};

export const ExpensePlatformDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpensePlatforms = async () => {
      try {
        const response = await apiService.getExpensesOptions();
        setOptions(response.platforms || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expense platforms:", error);
        setLoading(false);
      }
    };
  
    fetchExpensePlatforms();
  }, []);

  if (loading) return <div>Loading Expense Platforms...</div>; // Loading state

  return (
    <DropdownWrapper>
      <select
        name="platform"
        value={value || ""}
        onChange={onChange}
        className="form-select"
      >
        <option value="">Select Expense Platform</option>
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize */}
            </option>
          ))
        ) : (
          <option>No options available</option> // Fallback message if no options
        )}
      </select>
    </DropdownWrapper>
  );
};