import axios from 'axios';

const token = localStorage.getItem('token');

const apiService = {

  getCashFlowTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_options`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.cash_flow_types;
  },

  getBillerTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.biller_types;
  },

  getAmountTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("result coming from apiService: "+ response.data.data.amount_types)
    return response.data.data.amount_types;
  },

  getBillers: async (page) => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page },
    });
    return response.data;
  },

  deleteBiller: async (id) => {
    return axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/billers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getCashFlows: async (page) => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page },
    });
    return response.data;
  },

  getCashFlow: async (objectId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_cash_flow/${objectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("received data");
      console.log(response.data.item);
      return response.data.item; // Return the data you need from the response
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      throw error; // Re-throw or handle the error appropriately
    }
  },

  updateCashFlow: async (objectId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/${objectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.item; // Return the data you need from the response
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      throw error; // Re-throw or handle the error appropriately
    }
  },

  deleteCashFlow: async (id) => {
    return axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default apiService;
