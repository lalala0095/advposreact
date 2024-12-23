// src/hooks/useCashFlows.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCashFlows = (currentPage = 1) => {
  const [cash_flows, setCashFlows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashFlows = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
          },
        });

        setCashFlows(response.data.response.items);
        setTotalPages(response.data.response.total_pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cash_flows data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchCashFlows();
  }, [currentPage]);

  return { cash_flows, totalPages, loading, error };
};

export default useCashFlows;
