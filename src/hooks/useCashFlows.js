// src/hooks/useCashFlows.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCashFlows = (currentPage = 1) => {
  const [cash_flows, setCashFlows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // Trigger refresh
  
  const refreshData = () => setRefresh((prev) => !prev); // Toggle to force re-fetch

  useEffect(() => {
    const fetchCashFlows = async () => {
      try {
        setLoading(true); // Ensure loading is shown during data fetching
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
          },
        });

        console.log(response.data);

        setCashFlows(response.data.response.items);
        setTotalPages(response.data.response.total_pages);
      } catch (error) {
        console.error('Error fetching cash_flows data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Refreshing or changing page...');
    fetchCashFlows();
  }, [currentPage, refresh]);

  return { cash_flows, totalPages, loading, error, refreshData };

};
export default useCashFlows;
