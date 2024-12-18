/**
 * SocialLogin Component
 * 
 * Features:
 * - Social login options container
 * - Divider between social and email login
 * - Multiple social login options
 */

import React from 'react';
import GoogleLogin from './components/GoogleLogin/GoogleLogin';
import LinkedInLogin from './components/LinkedInLogin/LinkedInLogin';
import './SocialLogin.css';

const SocialLogin = ({
  onGoogleClick,
  onLinkedInClick,
  isLoading,
  isSignUp = true
}) => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "social-login" }, /*#__PURE__*/
    React.createElement("div", { className: "social-buttons" }, /*#__PURE__*/
    React.createElement(GoogleLogin, {
      onClick: onGoogleClick,
      isLoading: isLoading === 'google',
      isSignUp: isSignUp }
    ), /*#__PURE__*/
    React.createElement(LinkedInLogin, {
      onClick: onLinkedInClick,
      isLoading: isLoading === 'linkedin',
      isSignUp: isSignUp }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "divider" }, /*#__PURE__*/
    React.createElement("span", null, "Or")
    )
    ));

};

export default SocialLogin;