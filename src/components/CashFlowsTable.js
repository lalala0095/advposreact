// src/components/CashFlowsTable.js
import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCashFlows from '../hooks/useCashFlows';  // Import the custom hook
import { TableWrapper, Table, TableHeader, TableRow, TableData, EditButton, DeleteButton } from '../styles/BillersStyles';
import PaginationControl from './PaginationControl';
import axios from 'axios';

const CashFlowsTable = ({ handleFlashMessage }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const navigate = useNavigate();
  
  const { cash_flows, totalPages, loading, error } = useCashFlows(currentPage); // Use the hook

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (cashFlowId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/${cashFlowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleFlashMessage('CashFlow deleted successfully');
    } catch (error) {
      console.error('Error deleting cash_flow:', error);
    }
  };

  const handleEdit = (cashFlowId) => {
    navigate(`/edit-cash-flow/${cashFlowId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading cash_flows data</div>;

  return (
    <TableWrapper>
      <h2>Cash Flows List</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Date Added</TableHeader>
            <TableHeader>Cash Flow Name</TableHeader>
            <TableHeader>Cash Flow Type</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Platform</TableHeader>
            <TableHeader>Remarks</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {cash_flows.map((cash_flow) => (
            <TableRow key={cash_flow._id}>
              <TableData>{cash_flow.date_added}</TableData>
              <TableData>{cash_flow.cash_flow_name}</TableData>
              <TableData>{cash_flow.cash_flow_type}</TableData>
              <TableData>{cash_flow.amount}</TableData>
              <TableData>{cash_flow.platform}</TableData>
              <TableData>{cash_flow.remarks}</TableData>
              <TableData>
                <EditButton onClick={() => handleEdit(cash_flow._id)}>
                  <FaPenSquare />
                </EditButton>
                <DeleteButton onClick={() => handleDelete(cash_flow._id)}>
                  <FaTrashAlt />
                </DeleteButton>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </TableWrapper>
  );
};

export default CashFlowsTable;
