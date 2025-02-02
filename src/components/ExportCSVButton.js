import React, { useState } from "react";
import apiService from "../services/apiService";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const ExportCSVButtonStyled = styled(Link)`
  padding: 12px 24px;
  background: linear-gradient(135deg, rgb(94, 89, 152) 0%, rgb(123, 118, 180) 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 12;
  font-weight: 500;
  margin-left: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgb(35, 35, 82) 0%, rgb(65, 65, 120) 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ExportCSVButton = ({ plannerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExportCSV = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiService.exportPlanner(plannerId);
      // Check if the response is successful
      if (response) {
        // Create a Blob from the CSV response and initiate download
        const blob = response.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "comparison_data.csv"; // Set the default filename
        link.click(); // Trigger the download
      } else {
        setError("Failed to export CSV");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("An error occurred while exporting the CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ExportCSVButtonStyled onClick={handleExportCSV} disabled={loading}>
        {loading ? "Exporting..." : "Export CSV"}
      </ExportCSVButtonStyled>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ExportCSVButton;
