import React, { useState } from "react";
import apiService from "../services/apiService";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const ExportPDFButtonStyled = styled(Link)`
  padding: 12px 24px;
  background: rgba(102, 114, 102, 0.52);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 12;
  font-weight: 500;
  margin-left: 10px;
  margin-right: 60px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(158, 175, 159, 0.09);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ExportPDFButton = ({ plannerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExportPDF = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiService.exportPlannerPDF(plannerId);
      // Check if the response is successful
      if (response) {
        // Create a Blob from the PDF response and initiate download
        const blob = response.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "comparison_data.pdf"; // Set the default filename
        link.click(); // Trigger the download
      } else {
        setError("Failed to export PDF");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setError("An error occurred while exporting the PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ExportPDFButtonStyled onClick={handleExportPDF} disabled={loading}>
        {loading ? "Exporting..." : "Export PDF"}
      </ExportPDFButtonStyled>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ExportPDFButton;
