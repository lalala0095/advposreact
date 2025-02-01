import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCashFlows from '../hooks/useCashFlows';
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableData,
  EditButton,
  DeleteButton,
} from '../styles/BillersStyles';
import PaginationControl from './PaginationControl';
import apiService from '../services/apiService'; // Centralized API service

const CashFlowsTable = ({ 
  refreshKey,
  setRefreshKey,
  handleFlashMessage, 
  handleDelete,
  currentPage, 
  currentPageLimit, 
  onPageChange, 
  onPageLimitChange,
 }) => {
  const navigate = useNavigate();
  const { cash_flows, totalPages, loading, error } = useCashFlows(currentPage, currentPageLimit, refreshKey);

  const handleEdit = async (cash_flowId) => {
    console.log("editing for " + cash_flowId);
    try {
      // await apiService.getCashFlow(cash_flowId);
      navigate(`/edit-cash_flow/${cash_flowId}`);  
    } catch (error) {
      console.error(error);
      handleFlashMessage('Failed to edit cash_flow.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading cash_flows.</div>;

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
        handlePageChange={onPageChange}
        currentPageLimit={currentPageLimit}
        handlePageLimitChange={onPageLimitChange}
      />
    </TableWrapper>
  );
};

export default CashFlowsTable;
