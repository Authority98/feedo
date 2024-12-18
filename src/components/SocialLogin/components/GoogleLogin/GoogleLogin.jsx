/**
 * GoogleLogin Component
 * 
 * Features:
 * - Google Sign In/Sign Up button
 * - Loading state handling
 * - Consistent styling
 */

import React from 'react';
import { ReactComponent as GoogleIcon } from '../../../../assets/icons/google.svg';
import './GoogleLogin.css';

const GoogleLogin = ({
  onClick,
  isLoading,
  isSignUp = true
}) => {
  return (/*#__PURE__*/
    React.createElement("button", {
      className: `google-auth-btn ${isLoading ? 'loading' : ''}`,
      onClick: onClick,
      disabled: isLoading }, /*#__PURE__*/

    React.createElement(GoogleIcon, null),
    isLoading ?
    isSignUp ? 'Signing up...' : 'Signing in...' :
    isSignUp ? 'Sign up with Google' : 'Sign in with Google'

    ));

};

export default GoogleLogin;