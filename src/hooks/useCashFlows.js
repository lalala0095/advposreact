import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const useCashFlows = (currentPage = 1, currentPageLimit = 10, refreshKey) => {
  const [cash_flows, setCashFlows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPageLimit, setTotalPagesLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashFlows = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCashFlows(currentPage, currentPageLimit);
        const { items, total_pages, limit } = response.data;
        setCashFlows(items);
        setTotalPages(total_pages);
        setTotalPagesLimit(limit);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching cash_flows');
      } finally {
        setLoading(false);
      }
    };
    fetchCashFlows();
  }, [currentPage, currentPageLimit, refreshKey]);

  return { cash_flows, totalPages, totalPageLimit, loading, error };
};

export default useCashFlows;
