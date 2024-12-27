import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const useBillers = (currentPage = 1, currentPageLimit = 10, refreshKey) => {
  const [billers, setBillers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPageLimit, setTotalPagesLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('account_id');

  useEffect(() => {
    const fetchBillers = async () => {
      setLoading(true);
      try {
        const response = await apiService.getBillers(currentPage, currentPageLimit);
        // const { items, total_pages, limit } = response.data.total_pages;
        const { items, total_pages, limit } = response.data;
        setBillers(items);
        setTotalPages(total_pages);
        setTotalPagesLimit(limit);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching billers');
      } finally {
        setLoading(false);
      }
    };
    fetchBillers();
  }, [currentPage, currentPageLimit, refreshKey]);

  return { billers, totalPages, totalPageLimit, loading, error };
};

export default useBillers;
