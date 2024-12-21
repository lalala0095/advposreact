// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';

// const TableWrapper = styled.div`
//   padding: 20px;
//   width: 100%;
//   overflow-x: auto;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 20px;
// `;

// const TableHeader = styled.th`
//   padding: 10px;
//   background-color: #f4f4f4;
//   border: 1px solid #ddd;
// `;

// const TableRow = styled.tr`
//   &:hover {
//     background-color: #f1f1f1;
//   }
// `;

// const TableData = styled.td`
//   padding: 10px;
//   border: 1px solid #ddd;
// `;

// const BillersTable = () => {
//   const [billers, setBillers] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchBillers = async () => {
//       try {
//         // Get the token from localStorage (or wherever it is stored)
//         const token = localStorage.getItem('token');

//         // If the token is present, include it in the Authorization header
//         const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include Bearer token
//           },
//           params: {
//             page: currentPage,
//           }
//         });

//         setBillers(response.data.response.items);
//         setTotalPages(response.data.response.total_pages);
//       } catch (error) {
//         console.error('Error fetching billers data:', error);
//       }
//     };

//     fetchBillers();
//   }, [currentPage]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   return (
//     <TableWrapper>
//       <h2>Billers List</h2>
//       <Table>
//         <thead>
//           <tr>
//             <TableHeader>Biller Name</TableHeader>
//             <TableHeader>Biller Type</TableHeader>
//             <TableHeader>Amount</TableHeader>
//             <TableHeader>Due Date</TableHeader>
//             <TableHeader>Remarks</TableHeader>
//           </tr>
//         </thead>
//         <tbody>
//           {billers.map((biller) => (
//             <TableRow key={biller._id}>
//               <TableData>{biller.biller_name}</TableData>
//               <TableData>{biller.biller_type}</TableData>
//               <TableData>{biller.amount}</TableData>
//               <TableData>{biller.usual_due_date_day}</TableData>
//               <TableData>{biller.remarks}</TableData>
//             </TableRow>
//           ))}
//         </tbody>
//       </Table>
//       {/* Pagination controls */}
//       <div>
//         {currentPage > 1 && (
//           <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
//         )}
//         <span> Page {currentPage} of {totalPages} </span>
//         {currentPage < totalPages && (
//           <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
//         )}
//       </div>
//     </TableWrapper>
//   );
// };

// export default BillersTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon
import { useNavigate } from 'react-router-dom'; // Import navigate for redirection

const TableWrapper = styled.div`
  padding: 20px;
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 18px;
`;

const BillersTable = ({ handleFlashMessage }) => {
  const [billers, setBillers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch billers on initial render and page change
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
          }
        });

        setBillers(response.data.response.items);
        setTotalPages(response.data.response.total_pages);
      } catch (error) {
        console.error('Error fetching billers data:', error);
      }
    };

    fetchBillers();
  }, [currentPage]);

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle delete functionality
  const handleDelete = async (billerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/billers/${billerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Update the billers list by removing the deleted biller from state
      setBillers(billers.filter(biller => biller._id !== billerId));
  
      // Redirect to billers page with success message after deletion
      // navigate('/billers', {
      //   state: { message: 'Biller deleted successfully' },
      // });

      handleFlashMessage("Biller deleted successfully");
    } catch (error) {
      console.error('Error deleting biller:', error);
    }
  };

  return (
    <TableWrapper>
      <h2>Billers List</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Biller Name</TableHeader>
            <TableHeader>Biller Type</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Remarks</TableHeader>
            <TableHeader>Actions</TableHeader> {/* Add Actions column */}
          </tr>
        </thead>
        <tbody>
          {billers.map((biller) => (
            <TableRow key={biller._id}>
              <TableData>{biller.biller_name}</TableData>
              <TableData>{biller.biller_type}</TableData>
              <TableData>{biller.amount}</TableData>
              <TableData>{biller.usual_due_date_day}</TableData>
              <TableData>{biller.remarks}</TableData>
              <TableData>
                <DeleteButton onClick={() => handleDelete(biller._id)}>
                  <FaTrashAlt />
                </DeleteButton>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {/* Pagination controls */}
      <div>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        )}
        <span> Page {currentPage} of {totalPages} </span>
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        )}
      </div>
    </TableWrapper>
  );
};

export default BillersTable;
