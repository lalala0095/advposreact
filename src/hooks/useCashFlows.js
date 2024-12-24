import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const useCashFlows = (currentPage = 1, refreshKey) => {
  const [cash_flows, setCashFlows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashFlows = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCashFlows(currentPage);
        const { items, total_pages } = response.data;
        setCashFlows(items);
        setTotalPages(total_pages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching cash_flows');
      } finally {
        setLoading(false);
      }
    };
    fetchCashFlows();
  }, [currentPage, refreshKey]);

  return { cash_flows, totalPages, loading, error };
};

export default useCashFlows;
