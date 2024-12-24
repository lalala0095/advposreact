import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const useBillers = (currentPage = 1, refreshKey) => {
  const [billers, setBillers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillers = async () => {
      setLoading(true);
      try {
        const response = await apiService.getBillers(currentPage);
        const { items, total_pages } = response.data;
        setBillers(items);
        setTotalPages(total_pages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching billers');
      } finally {
        setLoading(false);
      }
    };
    fetchBillers();
  }, [currentPage, refreshKey]);

  return { billers, totalPages, loading, error };
};

export default useBillers;
