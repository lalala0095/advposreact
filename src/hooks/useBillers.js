// src/hooks/useBillers.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useBillers = (currentPage = 1) => {
  const [billers, setBillers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
          },
        });

        setBillers(response.data.response.items);
        setTotalPages(response.data.response.total_pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching billers data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchBillers();
  }, [currentPage]);

  return { billers, totalPages, loading, error };
};

export default useBillers;
