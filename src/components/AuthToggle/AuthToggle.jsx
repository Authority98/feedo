/**
 * AuthToggle Component
 * 
 * Features:
 * - Toggle between signup and login views
 * - Animated slider
 * - Active state handling
 */

import React from 'react';
import './AuthToggle.css';

const AuthToggle = ({ isSignupActive, onToggle }) => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "auth-toggle" }, /*#__PURE__*/
    React.createElement("button", {
      className: `toggle-btn ${isSignupActive ? 'active' : ''}`,
      onClick: () => onToggle(true) },
    "Sign Up"

    ), /*#__PURE__*/
    React.createElement("button", {
      className: `toggle-btn ${!isSignupActive ? 'active' : ''}`,
      onClick: () => onToggle(false) },
    "Login"

    ), /*#__PURE__*/
    React.createElement("div", { className: `slider ${!isSignupActive ? 'right' : 'left'}` })
    ));

};

export default AuthToggle;