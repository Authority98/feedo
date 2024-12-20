/**
 * LoadingSpinner Component
 * 
 * Features:
 * - Animated loading spinner for various loading states
 * - Customizable size (xs, sm, md, lg)
 * - Customizable color using Tailwind classes
 * - Optional loading text display
 * - Special styling for delete, set default, and 2FA spinners
 * - Backend-specific styling support
 * 
 * Props:
 * @param {string} size - Size of the spinner (xs, sm, md, lg)
 * @param {string} color - Tailwind color class for the spinner
 * @param {string} text - Optional loading text to display
 * @param {string} className - Additional CSS classes
 * @param {boolean} isDelete - Whether this is a delete icon spinner
 * @param {boolean} isSetDefault - Whether this is a set default spinner
 * @param {boolean} is2FA - Whether this is a 2FA verification spinner
 * @param {boolean} isBackend - Whether to use backend-specific styling
 */

import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'md',
  color = 'text-blue-500',
  text,
  className = '',
  isDelete = false,
  isSetDefault = false,
  is2FA = false,
  isBackend = false
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (isDelete) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "delete-icon-spinner-container" }, /*#__PURE__*/
      React.createElement(FiLoader, {
        className: `delete-icon-spinner ${color}`,
        "data-testid": "delete-spinner" }
      )
      ));

  }

  if (isSetDefault) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "set-default-spinner-container" }, /*#__PURE__*/
      React.createElement(FiLoader, {
        className: `set-default-spinner-icon ${color}`,
        "data-testid": "set-default-spinner" }
      ), /*#__PURE__*/
      React.createElement("span", { className: "set-default-spinner-text" }, "Setting as default...")
      ));

  }

  if (is2FA) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "two-factor-spinner-container" }, /*#__PURE__*/
      React.createElement(FiLoader, {
        className: `two-factor-spinner-icon ${color}`,
        "data-testid": "two-factor-spinner" }
      ), /*#__PURE__*/
      React.createElement("span", { className: "two-factor-spinner-text" }, "Verifying code...")
      ));

  }

  const containerClass = isBackend ? 'loading-spinner-container-backend' : 'loading-spinner-container';

  return (/*#__PURE__*/
    React.createElement("div", { className: `${containerClass} ${className}` }, /*#__PURE__*/
    React.createElement(FiLoader, {
      className: `loading-spinner ${sizeClasses[size]} ${color}`,
      "data-testid": "loading-spinner" }
    ),
    text && /*#__PURE__*/React.createElement("span", { className: `loading-text ${isBackend ? 'loading-text-backend' : ''}` }, text)
    ));

};

export default LoadingSpinner;