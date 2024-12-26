import React, { useState } from 'react';
import '../styles/Signup.css';
import apiService from '../services/apiService';
import { SubscriptionDropdown } from '../components/Dropdowns';
import { useNavigate } from 'react-router-dom';
import FlashMessage from '../components/FlashMessage';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
    name: "",
    email: "",
    subscription: "Select Subscription Type",
  });
  const [flashMessage, setFlashMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await apiService.signup(formData);
    if (response.status === 200) {
      navigate('/login');
      setFlashMessage(response.message);
    } 

    if (response.status === 400) {
      setFlashMessage(response.detail);
    } 

      // console.error("Signup failed:", err);
      // setFlashMessage("Network error. Please check your internet connection.");
      // Ensure err.response exists before accessing its properties
      // if (err.response) {
      //   // Check if the error has a status code
      //   if (err.response.status === 400) {
      //     // Check if "detail" exists in the response
      //     setFlashMessage(
      //       err.response?.detail || "An error occurred during signup"
      //     );
      //   } else {
      //     setFlashMessage("An unexpected error occurred. Please try again.");
      //   }
      // } else {
      //   // Handle cases where there's no response (network error or other issues)
      //   setFlashMessage("Network error. Please check your internet connection.");
      // }


  };

  return (
    <div className="signup-container" >
    {flashMessage && <FlashMessage message={flashMessage} />}
      <div className="signup-box">
        <h2 className="signup-title">Signup to AdvPOS App</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            name="username"  // Using name attribute to bind the state
            className="signup-input"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"  // Using name attribute to bind the state
            className="signup-input"
          />
          <input
            id="confirm_password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            name="confirm_password"  // Using name attribute to bind the state
            className="signup-input"
          />
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            name="name"  // Using name attribute to bind the state
            className="signup-input"
          />
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"  // Using name attribute to bind the state
            className="signup-input"
          />
          <SubscriptionDropdown value={formData.subscription} onChange={handleChange} />
          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
