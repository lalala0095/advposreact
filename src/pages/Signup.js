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
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFlashMessage("");
    try {
      const response = await apiService.signup(formData);
      if (response.status === 201) {
        console.log(response.data.message);
        navigate('/login', {state: {message: response.data.message + " You may now login."}});
      } else if (response.status === 400) {
        setFlashMessage(response.data?.detail);
      } else {
        setFlashMessage("An unexpected error occurred. Please try again.");
      }      
    } catch (err) {
      setFlashMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {flashMessage && <FlashMessage message={flashMessage} />}
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">Signup to AdvPOS App</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              name="username"
              className="signup-input"
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              className="signup-input"
            />
            <input
              id="confirm_password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              name="confirm_password"
              className="signup-input"
            />
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="signup-input"
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="signup-input"
            />
            <SubscriptionDropdown value={formData.subscription} onChange={handleChange} />
            <button type="submit" className="signup-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
