import React from 'react';
import { useToast } from '../../../../components/Toast/ToastContext';
import LinkedInIcon from '../../../../assets/icons/LinkedInIcon';
import './LinkedInLogin.css';

const LinkedInLogin = ({ isSignUp, isLoading }) => {
  const { showToast } = useToast();

  const handleLinkedInLogin = () => {
    showToast('LinkedIn sign in is not available yet', 'info');
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "linkedin-button-wrapper" }, /*#__PURE__*/
    React.createElement("button", {
      className: `linkedin-auth-btn ${isLoading ? 'loading' : ''}`,
      onClick: handleLinkedInLogin,
      disabled: isLoading }, /*#__PURE__*/

    React.createElement(LinkedInIcon, null), /*#__PURE__*/
    React.createElement("span", null,
    isLoading ? 'Loading...' : isSignUp ? 'Sign up with LinkedIn' : 'Sign in with LinkedIn'
    )
    )
    ));

};

export default LinkedInLogin;