import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useBillers from '../hooks/useBillers';
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

const BillersTable = ({ refreshKey, handleFlashMessage }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const navigate = useNavigate();
  const { billers, totalPages, loading, error } = useBillers(currentPage, refreshKey);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const handleDelete = async (billerId) => {
    try {
      await apiService.deleteBiller(billerId);
      handleFlashMessage('Biller deleted successfully.');
    } catch (error) {
      console.error(error);
      handleFlashMessage('Failed to delete biller.');
    }
  };

  const handleEdit = (billerId) => navigate(`/edit-biller/${billerId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading billers.</div>;

  return (
    <TableWrapper>
      <h2>Billers List</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Date Added</TableHeader>
            <TableHeader>Biller Name</TableHeader>
            <TableHeader>Biller Type</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Amount Type</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Remarks</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {billers.map((biller) => (
            <TableRow key={biller._id}>
              <TableData>{biller.date_added}</TableData>
              <TableData>{biller.biller_name}</TableData>
              <TableData>{biller.biller_type}</TableData>
              <TableData>{biller.amount}</TableData>
              <TableData>{biller.amount_type}</TableData>
              <TableData>{biller.usual_due_date_day}</TableData>
              <TableData>{biller.remarks}</TableData>
              <TableData>
                <EditButton onClick={() => handleEdit(biller._id)}>
                  <FaPenSquare />
                </EditButton>
                <DeleteButton onClick={() => handleDelete(biller._id)}>
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

export default BillersTable;
