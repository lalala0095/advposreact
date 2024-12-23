import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Login function: makes the API call and manages token
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FASTAPI_URL}/accounts/login`, {
        username,
        password,
      });
      const { access_token, account_id } = response.data;

      // Store token and account_id in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('account_id', account_id);

      setToken(access_token);
      setIsAuthenticated(true)
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid login credentials");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('account_id');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/accounts/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(true);
      setUser(response.data.account_object);
      setToken(token);

      // Check subscription expiration
      const { subscription_expiration } = response.data.account_object;
      const isExpired = new Date(subscription_expiration) < new Date();
      if (isExpired) {
        console.warn("Subscription expired. Limited access provided.");
        // Handle expired subscriptions here (e.g., notify user, restrict features)
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
