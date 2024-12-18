/**
 * Delete Account Popup Component
 * Features:
 * - Password confirmation for email users
 * - Email confirmation for Google users
 * - Clear warning about account deletion
 * - Smooth animations and transitions
 */

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiX, FiAlertTriangle, FiMail } from 'react-icons/fi';
import { auth } from '../../firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useToast } from '../../components/Toast/ToastContext';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

const DeleteAccount = ({ isOpen, onClose, onConfirmDelete }) => {
  const [password, setPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is a Google user
  const isGoogleUser = user?.profile?.provider === 'google.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isGoogleUser) {
        // For Google users, verify email confirmation
        if (confirmEmail !== user.profile.email) {
          setError('Email does not match your account email');
          setLoading(false);
          return;
        }
      } else {
        // For email users, require password confirmation
        const user = auth.currentUser;
        if (!user || !user.email) {
          throw new Error('No authenticated user found');
        }

        // Require password confirmation for security
        const credential = EmailAuthProvider.credential(
          user.email,
          password
        );

        // Reauthenticate user
        await reauthenticateWithCredential(user, credential);
      }

      // Call the delete function
      await onConfirmDelete();

      // Close the popup
      onClose();

      // Navigate to home page after successful deletion
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Delete account error:', error);

      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please sign out and sign in again to delete your account');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection');
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "popup-overlay" }, /*#__PURE__*/
    React.createElement("div", { className: "popup-content delete-account-popup" }, /*#__PURE__*/
    React.createElement("div", { className: "popup-header" }, /*#__PURE__*/
    React.createElement("h3", null, "Delete Account"), /*#__PURE__*/
    React.createElement("button", { className: "close-btn", onClick: onClose }, /*#__PURE__*/
    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "warning-section" }, /*#__PURE__*/
    React.createElement("div", { className: "warning-icon" }, /*#__PURE__*/
    React.createElement(FiAlertTriangle, null)
    ), /*#__PURE__*/
    React.createElement("h4", null, "Warning: This action cannot be undone"), /*#__PURE__*/
    React.createElement("p", null, "Deleting your account will:"

    ), /*#__PURE__*/
    React.createElement("ul", null, /*#__PURE__*/
    React.createElement("li", null, "Permanently delete your profile and all associated data"), /*#__PURE__*/
    React.createElement("li", null, "Remove access to all your applications and submissions"), /*#__PURE__*/
    React.createElement("li", null, "Cancel any active subscriptions")
    )
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit, className: "delete-form" },

    isGoogleUser && /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Confirm your email address"), /*#__PURE__*/
    React.createElement("div", { className: "email-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiMail, { className: "field-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      value: confirmEmail,
      onChange: (e) => {
        setConfirmEmail(e.target.value);
        setError('');
      },
      className: error ? 'error' : '',
      placeholder: user.profile.email }
    )
    ),
    error && /*#__PURE__*/
    React.createElement("span", { className: "error-message" },
    error
    ), /*#__PURE__*/

    React.createElement("p", { className: "confirmation-hint" }, "Please enter your email address (",
    user.profile.email, ") to confirm deletion"
    )
    ),



    !isGoogleUser && /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Confirm your password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiLock, { className: "field-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: showPassword ? 'text' : 'password',
      value: password,
      onChange: (e) => {
        setPassword(e.target.value);
        setError('');
      },
      className: error ? 'error' : '',
      placeholder: "Enter your password" }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => setShowPassword(!showPassword) },

    showPassword ? /*#__PURE__*/React.createElement(FiEyeOff, null) : /*#__PURE__*/React.createElement(FiEye, null)
    )
    ),
    error && /*#__PURE__*/
    React.createElement("span", { className: "error-message" },
    error
    )

    ), /*#__PURE__*/


    React.createElement("div", { className: "form-actions" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "cancel-btn",
      onClick: onClose,
      disabled: loading },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement("button", {
      type: "submit",
      className: `delete-btn ${loading ? 'loading' : ''}`,
      disabled: loading || !isGoogleUser && !password || isGoogleUser && !confirmEmail },

    loading ? 'Deleting Account...' : 'Delete My Account'
    )
    )
    )
    )
    ));

};

export default DeleteAccount;