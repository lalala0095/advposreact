import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const useExpenses = (currentPage = 1, currentPageLimit = 10, refreshKey) => {
  const [expenses, setExpenses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPageLimit, setTotalPagesLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await apiService.getExpenses(currentPage, currentPageLimit);
        // const { items, total_pages, limit } = response.data.total_pages;
        const { items, total_pages, limit } = response.data;
        setExpenses(items);
        setTotalPages(total_pages);
        setTotalPagesLimit(limit);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [currentPage, currentPageLimit, refreshKey]);

  return { expenses, totalPages, totalPageLimit, loading, error };
};

export default useExpenses;
