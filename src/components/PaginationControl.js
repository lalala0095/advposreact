import React, { useState, useEffect } from 'react';
import { PaginationControlStyle } from '../styles/BillersStyles';

function PaginationControl({ currentPage, currentPageLimit, totalPages, handlePageChange, handlePageLimitChange }) {
  const [pageInput, setPageInput] = useState(currentPage); // Default to current page
  const [pageLimit, setPageLimit] = useState(10); // Default to 10, initial load only

  // Effect to set the default page limit only once on initial load
  // useEffect(() => {
    // setPageLimit(10); // Only set to 10 on mount
  // }, []); // Empty dependency array ensures it only runs once

  useEffect(() => {
    setPageLimit(currentPageLimit); // Sync pageLimit with the parent's state
  }, [currentPageLimit]); // Only update when currentPageLimit changes
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setPageInput(value);
    } else if (value === '') {
      setPageInput('');
    }
  };

  const handlePageLimit = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setPageLimit(value);
      // handlePageLimitChange(value);
    } else if (value === '') {
      setPageLimit(10);
      // handlePageLimitChange(10);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();

    const pageNumber = parseInt(pageInput, 10);
    const effectivePageLimit = parseInt(pageLimit, 10);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      handlePageLimitChange(effectivePageLimit);
    }
    console.log(`pageNumber: ${pageNumber}`);
    console.log(`effectivePageLimit: ${effectivePageLimit}`);
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
            value={pageInput}
            onChange={handleInputChange}
            min="1"
            max={totalPages}
          />
        </label>
      </form>
      <form onSubmit={handleInputSubmit} style={{ display: 'inline', marginLeft: '10px' }}>
        <label>
          Set page limit:
          <input
            type="number"
            value={pageLimit}
            onChange={handlePageLimit}
            min="1"
            max="10"
          />
        </label>
        <button type="submit">Go</button>
      </form>
    </PaginationControlStyle>
  );
}

export default PaginationControl;


