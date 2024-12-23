import React, { useState } from 'react';
import { PaginationControlStyle } from '../styles/BillersStyles';

function PaginationControl({ currentPage, totalPages, handlePageChange }) {
  const [pageInput, setPageInput] = useState(currentPage);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setPageInput(value);
    } else if (value === '') {
      setPageInput('');
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <PaginationControlStyle>
      {currentPage > 1 && (
        <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
      )}
      <span> Page {currentPage} of {totalPages} </span>
      {currentPage < totalPages && (
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      )}
      <form onSubmit={handleInputSubmit} style={{ display: 'inline', marginLeft: '10px' }}>
        <label>
          Go to page:
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={handleInputChange}
            style={{ width: '50px', marginLeft: '5px' }}
          />
        </label>
        <button type="submit">Go</button>
      </form>
    </PaginationControlStyle>
  );
}

export default PaginationControl;
