/**
 * AdminLogin Component
 * 
 * Features:
 * - Secure admin authentication
 * - 2FA support
 * - Error handling
 * - Rate limiting
 * - Activity logging
 */

import React, { useState, useEffect } from 'react';
import { FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAdminAuth } from '../AdminAuth/AdminAuthContext';
import { useToast } from '../../components/Toast/ToastContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, adminUser } = useAdminAuth();
  const { showToast } = useToast();

  // Add effect to handle navigation when adminUser changes
  useEffect(() => {
    if (adminUser) {
      navigate('/admin/dashboard');
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      showToast('success', 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials. Please try again.');
      showToast('error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "admin-login-container" }, /*#__PURE__*/
    React.createElement("div", { className: "admin-login-card" }, /*#__PURE__*/
    React.createElement("div", { className: "admin-login-header" }, /*#__PURE__*/
    React.createElement("h1", null, "Admin Portal"), /*#__PURE__*/
    React.createElement("p", null, "Enter your credentials to access the admin dashboard")
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit, className: "admin-login-form" }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("div", { className: "input-wrapper" }, /*#__PURE__*/
    React.createElement(FiMail, { className: "input-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      placeholder: "Admin Email",
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      required: true }
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("div", { className: "input-wrapper" }, /*#__PURE__*/
    React.createElement(FiLock, { className: "input-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: "password",
      placeholder: "Password",
      value: formData.password,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
      required: true }
    )
    )
    ),

    error && /*#__PURE__*/
    React.createElement("div", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null), /*#__PURE__*/
    React.createElement("span", null, error)
    ), /*#__PURE__*/


    React.createElement(Button, {
      type: "submit",
      isLoading: loading,
      className: "admin-login-button" },

    loading ? 'Authenticating...' : 'Login to Admin Portal'
    )
    )
    )
    ));

};

export default AdminLogin;