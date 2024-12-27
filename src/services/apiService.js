import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token') || '';
};


const apiService = {
  getSubscriptionOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/accounts/get_options`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data.options;
  },

  getCashFlowTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_options`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data.data.cash_flow_types;
  },

  getBillerTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data.data.biller_types;
  },

  getAmountTypeOptions: async () => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers/get_options`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    console.log("result coming from apiService: "+ response.data.data.amount_types)
    return response.data.data.amount_types;
  },

  getBillers: async (page, pageLimit) => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/billers`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      params: { "page": page, "limit": pageLimit },
    });
    return response.data;
  },

  deleteBiller: async (id) => {
    return axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/billers/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  getCashFlows: async (page) => {
    const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      params: { page },
    });
    return response.data;
  },

  getCashFlow: async (objectId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/get_cash_flow/${objectId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data.item; // Return the data you need from the response
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      throw error; // Re-throw or handle the error appropriately
    }
  },

  deleteCashFlow: async (id) => {
    return axios.delete(`${process.env.REACT_APP_FASTAPI_URL}/cash_flows/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FASTAPI_URL}/accounts/login`, {
        username,
        password,
      });
      const { access_token, account_id } = response.data;

      // Store token and account_id in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('account_id', account_id);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { access_token, account_id };
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid login credentials");
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FASTAPI_URL}/accounts/logout`, 
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return response.data.message;
   } catch (err) {
      console.error("Logout failed:", err);
      throw new Error("Invalid credentials");
    }
  },

  signup: async (userData) => {
    let response;
    try {
      response = await axios.post(`${process.env.REACT_APP_FASTAPI_URL}/accounts/signup`, 
        userData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );  
    } catch (err) {
      console.error("Signup failed:", err);
      return err.response;
    }
    console.log("response status: " + response.status);
    // throw new Error("Invalid credentials");
    return response; 
  }
};

export default apiService;
