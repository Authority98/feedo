/**
 * TwoFactorVerification Component
 * 
 * Features:
 * - Handles 2FA code verification
 * - Shows loading state
 * - Error handling
 * - Clean UI for code input
 * - Auto-submit when code length is 6
 */

import React, { useEffect } from 'react';
import { FiShield } from 'react-icons/fi';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './TwoFactorVerification.css';

const TwoFactorVerification = ({
  twoFactorCode,
  setTwoFactorCode,
  onSubmit,
  isLoading,
  error,
  setErrors
}) => {
  // Auto-submit when code length is 6
  useEffect(() => {
    if (twoFactorCode.length === 6 && !isLoading && !error) {
      onSubmit(new Event('submit'));
    }
  }, [twoFactorCode, isLoading, error, onSubmit]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value !== twoFactorCode) {
      setTwoFactorCode(value);
      // Clear error when input changes
      if (error) {
        setErrors({});
      }
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "two-factor-modal" }, /*#__PURE__*/
    React.createElement("div", { className: "two-factor-content" }, /*#__PURE__*/
    React.createElement("div", { className: "two-factor-header" }, /*#__PURE__*/
    React.createElement(FiShield, { className: "shield-icon" }), /*#__PURE__*/
    React.createElement("h2", null, "Two-Factor Authentication"), /*#__PURE__*/
    React.createElement("p", null, "Please enter the verification code from your authenticator app.")
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: onSubmit, className: "two-factor-form" }, /*#__PURE__*/
    React.createElement("div", { className: "code-input-container" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      maxLength: "6",
      value: twoFactorCode,
      onChange: handleChange,
      placeholder: "Enter 6-digit code",
      className: error ? 'error' : '',
      disabled: isLoading,
      autoFocus: true }
    ),
    error && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, error)

    ),


    isLoading && /*#__PURE__*/
    React.createElement("div", { className: "loading-content" }, /*#__PURE__*/
    React.createElement(LoadingSpinner, { is2FA: true, color: "text-blue-500" })
    )

    )
    )
    ));

};

export default TwoFactorVerification;