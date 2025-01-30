import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import apiService from '../services/apiService';
import FlashMessage from './FlashMessage';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    console.log("AuthContext State:", { isAuthenticated, user, token, userId });
  }, [isAuthenticated, user, token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FASTAPI_URL}/accounts/login`, {
        username,
        password,
      });
      const { access_token, account_id } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('account_id', account_id);

      setToken(access_token);
      setIsAuthenticated(true);
      setUser(response.data.account_object); // Assuming account details are returned here
      setUserId(account_id);
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid login credentials");
    }
  };

  const logout = async () => {
    try {
      const response = await apiService.logout();
      setFlashMessage(response.message || "Logged out successfully.");
    } catch (err) {
      console.error("Error during logout:", err);
      setFlashMessage("Error during logout. Please try again.");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('account_id');
      setIsAuthenticated(false);
      setUser(null);
      setUserId(null);
      setToken(null);
      navigate('/login');
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_FASTAPI_URL}/accounts/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(true);
      setUser(response.data.account_object);
      setUserId(response.data.account_object.sub);
      setToken(token);

      const { subscription_expiration } = response.data.account_object;
      const isExpired = new Date(subscription_expiration) < new Date();
      if (isExpired) {
        console.warn("Subscription expired. Limited access provided.");
        setFlashMessage("Your subscription has expired. Please renew to regain full access.");
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setIsAuthenticated(false);

      if (err.response?.status === 401) {
        setFlashMessage("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
      {flashMessage && <FlashMessage message={flashMessage} onClose={() => setFlashMessage(null)} />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
