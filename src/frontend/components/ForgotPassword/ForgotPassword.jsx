/**
 * ForgotPassword Component
 * 
 * A modal component that handles the password reset functionality.
 * Features:
 * - Email input for password reset
 * - Firebase password reset integration
 * - Success/Error states
 * - Loading states
 * - Responsive design
 */

import React, { useState } from 'react';
import { auth } from '../../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { handleAuthError } from '../../../components/Toast/toastnotifications';
import { useToast } from '../../../components/Toast/ToastContext';
import AuthButton from '../../../components/AuthButton/AuthButton';
import './ForgotPassword.css';

const ForgotPassword = ({ isOpen, onClose }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Check if the email is a Gmail address
    if (resetEmail.toLowerCase().includes('gmail')) {
      showToast('Gmail users should use the "Sign in with Google" option instead of password reset.', 'error');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      showToast('Password reset email sent successfully!', 'success');
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = handleAuthError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "forgot-password-modal" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-content" }, /*#__PURE__*/
    React.createElement("button", {
      className: "close-modal",
      onClick: () => {
        onClose();
        setResetEmail('');
        setResetEmailSent(false);
        setErrors({});
      } },
    "\xD7"

    ),

    !resetEmailSent ? /*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("h2", null, "Reset Password"), /*#__PURE__*/
    React.createElement("p", null, "Enter your email address and we'll send you instructions to reset your password."), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "resetEmail" }, "Email"), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      id: "resetEmail",
      value: resetEmail,
      onChange: (e) => setResetEmail(e.target.value),
      className: errors.resetEmail ? 'error' : '',
      placeholder: "Enter your email" }
    ),
    errors.resetEmail && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, errors.resetEmail)

    ), /*#__PURE__*/

    React.createElement(AuthButton, {
      isLoading: isLoading,
      loadingText: "Sending..." },
    "Send Reset Link"

    )
    )
    ) : /*#__PURE__*/

    React.createElement("div", { className: "reset-success" }, /*#__PURE__*/
    React.createElement("h2", null, "Email Sent!"), /*#__PURE__*/
    React.createElement("p", null, "We've sent password reset instructions to:", /*#__PURE__*/

    React.createElement("br", null), /*#__PURE__*/
    React.createElement("strong", null, resetEmail)
    ), /*#__PURE__*/
    React.createElement("p", { className: "note" }, "Please check your email and follow the instructions to reset your password. Don't forget to check your spam folder."


    ), /*#__PURE__*/
    React.createElement("button", {
      className: "close-btn",
      onClick: () => {
        onClose();
        setResetEmail('');
        setResetEmailSent(false);
      } },
    "Close"

    )
    )

    )
    ));

};

export default ForgotPassword;