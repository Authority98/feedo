/**
 * Change Password Popup Component
 * Features:
 * - Current password validation
 * - New password requirements checking
 * - Password strength indicator
 * - Real-time validation feedback
 * - Smooth animations and transitions
 */

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import './ChangePassword.css';
import { auth } from '../../firebase/config';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword } from
'firebase/auth';
import { useToast } from '../../components/Toast/ToastContext';

const ChangePassword = ({ isOpen, onClose, onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Password requirements
  const requirements = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'number', label: 'One number', regex: /[0-9]/ },
  { id: 'special', label: 'One special character', regex: /[!@#$%^&*]/ }];


  const validatePassword = (password) => {
    return requirements.map((req) => ({
      ...req,
      met: req.regex.test(password)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check required fields
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    }

    // Check password match
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check password requirements
    const passwordChecks = validatePassword(formData.newPassword);
    const hasFailedRequirements = passwordChecks.some((req) => !req.met);
    if (hasFailedRequirements) {
      newErrors.newPassword = 'Password does not meet all requirements';
    }

    // Check if new password is same as current
    if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Create credentials with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      // Call onPasswordChanged callback
      if (onPasswordChanged) {
        await onPasswordChanged();
      }

      showToast('Password changed successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Password change error:', error);

      // Handle specific error cases
      if (error.code === 'auth/wrong-password') {
        setErrors({
          currentPassword: 'Current password is incorrect'
        });
      } else if (error.code === 'auth/requires-recent-login') {
        setErrors({
          submit: 'Please log in again before changing your password'
        });
      } else {
        setErrors({
          submit: 'Failed to change password. Please try again.'
        });
      }
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "popup-overlay" }, /*#__PURE__*/
    React.createElement("div", { className: "popup-content" }, /*#__PURE__*/
    React.createElement("div", { className: "popup-header" }, /*#__PURE__*/
    React.createElement("h3", null, "Change Password"), /*#__PURE__*/
    React.createElement("button", { className: "close-btn", onClick: onClose }, /*#__PURE__*/
    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit, className: "password-form" }, /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Current Password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiLock, { className: "field-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: showPasswords.current ? 'text' : 'password',
      name: "currentPassword",
      value: formData.currentPassword,
      onChange: handleInputChange,
      className: errors.currentPassword ? 'error' : '' }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => togglePasswordVisibility('current') },

    showPasswords.current ? /*#__PURE__*/React.createElement(FiEyeOff, null) : /*#__PURE__*/React.createElement(FiEye, null)
    )
    ),
    errors.currentPassword && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null), " ", errors.currentPassword
    )

    ), /*#__PURE__*/


    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "New Password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiLock, { className: "field-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: showPasswords.new ? 'text' : 'password',
      name: "newPassword",
      value: formData.newPassword,
      onChange: handleInputChange,
      className: errors.newPassword ? 'error' : '' }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => togglePasswordVisibility('new') },

    showPasswords.new ? /*#__PURE__*/React.createElement(FiEyeOff, null) : /*#__PURE__*/React.createElement(FiEye, null)
    )
    ),
    errors.newPassword && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null), " ", errors.newPassword
    )

    ), /*#__PURE__*/


    React.createElement("div", { className: "password-requirements" },
    validatePassword(formData.newPassword).map((req) => /*#__PURE__*/
    React.createElement("div", {
      key: req.id,
      className: `requirement ${req.met ? 'met' : ''}` },

    req.met ? /*#__PURE__*/React.createElement(FiCheck, null) : /*#__PURE__*/React.createElement(FiAlertCircle, null), /*#__PURE__*/
    React.createElement("span", null, req.label)
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Confirm New Password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiLock, { className: "field-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: showPasswords.confirm ? 'text' : 'password',
      name: "confirmPassword",
      value: formData.confirmPassword,
      onChange: handleInputChange,
      className: errors.confirmPassword ? 'error' : '' }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => togglePasswordVisibility('confirm') },

    showPasswords.confirm ? /*#__PURE__*/React.createElement(FiEyeOff, null) : /*#__PURE__*/React.createElement(FiEye, null)
    )
    ),
    errors.confirmPassword && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null), " ", errors.confirmPassword
    )

    ),

    errors.submit && /*#__PURE__*/
    React.createElement("div", { className: "submit-error" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null), " ", errors.submit
    ), /*#__PURE__*/


    React.createElement("div", { className: "form-actions" }, /*#__PURE__*/
    React.createElement("button", { type: "button", className: "cancel-btn", onClick: onClose }, "Cancel"

    ), /*#__PURE__*/
    React.createElement("button", {
      type: "submit",
      className: `submit-btn ${loading ? 'loading' : ''}`,
      disabled: loading },

    loading ? 'Changing Password...' : 'Change Password'
    )
    )
    )
    )
    ));

};

export default ChangePassword;