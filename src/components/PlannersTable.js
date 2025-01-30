import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
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
} from '../styles/BillersStyles';
import apiService from '../services/apiService';
import PaginationControl from './PaginationControl';

const PlannersTable = ({ refreshKey, handleFlashMessage, currentPage, currentPageLimit, onPageChange, onPageLimitChange }) => {
  const navigate = useNavigate();
  const { planners, totalPages, loading, error } = usePlanners(currentPage, currentPageLimit, refreshKey);
  // const [currentPage, setCurrentPage] = React.useState(1);
  // const [currentPageLimit, setCurrentPageLimit] = React.useState(10);
  
  // const forceUpdate = () => {
  //   setCurrentPage(1)
  // };

  // const handlePageChange = (newPage) => setCurrentPage(newPage);

  // const handlePageLimitChange = (newPageLimit) => setCurrentPageLimit(newPageLimit);

  const handleDelete = async (plannerId) => {
    const response = await apiService.deletePlanner(plannerId);
    try {
      setTimeout(() => {
        // forceUpdate();
        handleFlashMessage(response.data.message + " Refreshing the page.");
        navigate('/cash_flows');
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        // forceUpdate();
        console.error(error);
        handleFlashMessage(response.detail + " Refreshing the page.");
        // navigate('/cash_flows');  
      }, 1000);
    }
  };

  const handleEdit = (plannerId) => navigate(`/edit-planner/${plannerId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading planners.</div>;

  return (
    <TableWrapper>
      <h2>Planners List</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Date of Transaction</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Planner Type</TableHeader>
            <TableHeader>Platform</TableHeader>
            <TableHeader>Store</TableHeader>
            <TableHeader>Remarks</TableHeader>
            <TableHeader>Payment Method</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {planners.map((planner) => (
            <TableRow key={planner._id}>
              <TableData>{planner.date_of_transaction}</TableData>
              <TableData>{planner.description}</TableData>
              <TableData>{planner.amount}</TableData>
              <TableData>{planner.planner_type}</TableData>
              <TableData>{planner.platform}</TableData>
              <TableData>{planner.store}</TableData>
              <TableData>{planner.remarks}</TableData>
              <TableData>{planner.payment_method}</TableData>
              <TableData>
                <EditButton onClick={() => handleEdit(planner._id)}>
                  <FaPenSquare />
                </EditButton>
                <DeleteButton onClick={() => handleDelete(planner._id)}>
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

export default PlannersTable;
