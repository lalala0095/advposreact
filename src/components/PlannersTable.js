import React, { useState } from 'react';
import { FaTrashAlt, FaPenSquare, FaEye } from 'react-icons/fa'; // Import FaEye for View Comparison button
import { useNavigate } from 'react-router-dom';
import usePlanners from '../hooks/usePlanners';
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableData,
  EditButton,
  DeleteButton,
  ViewComparisonButton, // Add ViewComparisonButton for custom styling
} from '../styles/BillersStyles';
import apiService from '../services/apiService';
import PaginationControl from './PaginationControl';
import ViewComparison from './ViewComparison'; // The component to show the comparison

const PlannersTable = ({ 
  refreshKey,
  setRefreshKey,
  handleFlashMessage, 
  handleDelete,
  currentPage, 
  currentPageLimit, 
  onPageChange, 
  onPageLimitChange 
}) => {
  const navigate = useNavigate();

  const { planners, totalPages, loading, error } = usePlanners(currentPage, currentPageLimit, refreshKey);
  
  const [selectedPlannerId, setSelectedPlannerId] = useState(null); // Track the selected planner for comparison
  const [plannerData, setPlannerData] = useState(null); // Store the planner data for comparison
  
  const handleEdit = (plannerId) => navigate(`/edit-planner/${plannerId}`);

  const handleViewComparison = async (plannerId) => {
    // Toggle planner selection for comparison
    if (selectedPlannerId === plannerId) {
      setSelectedPlannerId(null); // Deselect if the same planner is clicked
      setPlannerData(null); // Reset planner data when deselecting
    } else {
      setSelectedPlannerId(plannerId); // Set the selected planner ID
      const result = await apiService.getPlanner(plannerId); // Fetch the planner data
      console.log("result data: " + result.planner.planner_name)
      setPlannerData(result.planner); // Store the data for comparison
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading planners.</div>;

  return (
    <div>
      <TableWrapper>
        <h2>Planners List</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Date Added</TableHeader>
              <TableHeader>Planner Name</TableHeader>
              <TableHeader>Expenses</TableHeader>
              <TableHeader>Cash Flows</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
          {(planners || []).map((planner) => (
            // {planners.map((planner) => (
              <TableRow key={planner._id}>
                <TableData>{planner.date_added}</TableData>
                <TableData>{planner.planner_name}</TableData>
                <TableData>{planner.expenses}</TableData>
                <TableData>{planner.cash_flows}</TableData>
                <TableData>
                  <EditButton title='Edit' onClick={() => handleEdit(planner._id)}>
                    <FaPenSquare />
                  </EditButton>
                  <DeleteButton title='Delete' onClick={() => handleDelete(planner._id)}>
                    <FaTrashAlt />
                  </DeleteButton>
                  <ViewComparisonButton title='View Comparison' onClick={() => handleViewComparison(planner._id)}>
                    <FaEye />
                  </ViewComparisonButton>
                </TableData>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <PaginationControl
          currentPage={currentPage}
          currentPageLimit={currentPageLimit}
          totalPages={totalPages}
          handlePageChange={onPageChange}
          handlePageLimitChange={onPageLimitChange}
        />
      </TableWrapper>

      {/* Display comparison section below the table */}
      {selectedPlannerId && plannerData && (
        <div style={{ marginTop: '20px' }}>
          <ViewComparison plannerData={plannerData} />
        </div>
      )}
    </div>
  );
};

export default PlannersTable;
