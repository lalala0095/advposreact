import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useExpenses from '../hooks/useExpenses';
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

const ExpensesTable = ({ 
  refreshKey,
  setRefreshKey,
  handleFlashMessage,
  handleDelete, 
  currentPage, 
  currentPageLimit, 
  onPageChange, 
  onPageLimitChange }) => {
  const navigate = useNavigate();
  const { expenses, totalPages, loading, error } = useExpenses(currentPage, currentPageLimit, refreshKey);

  const handleEdit = (expenseId) => navigate(`/edit-expense/${expenseId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading expenses.</div>;

  return (
    <TableWrapper>
      <h2>Expenses List</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Date of Transaction</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Expense Type</TableHeader>
            <TableHeader>Platform</TableHeader>
            <TableHeader>Store</TableHeader>
            <TableHeader>Remarks</TableHeader>
            <TableHeader>Payment Method</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <TableRow key={expense._id}>
              <TableData>{expense.date_of_transaction}</TableData>
              <TableData>{expense.description}</TableData>
              <TableData>{expense.amount}</TableData>
              <TableData>{expense.expense_type}</TableData>
              <TableData>{expense.platform}</TableData>
              <TableData>{expense.store}</TableData>
              <TableData>{expense.remarks}</TableData>
              <TableData>{expense.payment_method}</TableData>
              <TableData>
                <EditButton onClick={() => handleEdit(expense._id)}>
                  <FaPenSquare />
                </EditButton>
                <DeleteButton onClick={() => handleDelete(expense._id)}>
                  <FaTrashAlt />
                </DeleteButton>
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
  );
};

export default ExpensesTable;
