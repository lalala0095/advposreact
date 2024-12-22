import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Get login from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call login function from AuthContext to handle API call
      await login(username, password);

      // Redirect to dashboard if login is successful
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to AdvPOS App</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
