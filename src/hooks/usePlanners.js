import { useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Centralized API service

const usePlanners = (currentPage = 1, currentPageLimit = 10, refreshKey) => {
  const [planners, setPlanners] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPageLimit, setTotalPagesLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanners = async () => {
      setLoading(true);
      try {
        const response = await apiService.getPlanners(currentPage, currentPageLimit);
        // const { items, total_pages, limit } = response.total_pages;
        const { items, total_pages, limit } = response;
        setPlanners(items);
        setTotalPages(total_pages);
        setTotalPagesLimit(limit);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching planners');
      } finally {
        setLoading(false);
      }
    };
    fetchPlanners();
  }, [currentPage, currentPageLimit, refreshKey]);

  return { planners, totalPages, totalPageLimit, loading, error };
};

export default usePlanners;
