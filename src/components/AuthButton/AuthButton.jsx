/**
 * AuthButton Component
 * 
 * Features:
 * - Reusable button for auth actions
 * - Loading state (spinner only)
 * - Gradient background
 * - Hover effects
 */

import React from 'react';
import './AuthButton.css';

const AuthButton = ({
  type = 'submit',
  isLoading = false,
  children,
  onClick,
  className = ''
}) => {
  return (/*#__PURE__*/
    React.createElement("button", {
      type: type,
      className: `auth-button ${isLoading ? 'loading' : ''} ${className}`,
      disabled: isLoading,
      onClick: onClick }, /*#__PURE__*/

    React.createElement("span", null, children)
    ));

};

export default AuthButton;