/**
 * SetDefaultSpinner Component
 * 
 * Features:
 * - Specific spinner for set default action
 * - Matches set default button styling
 * - Includes loading text
 */

import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './SetDefaultSpinner.css';

const SetDefaultSpinner = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "set-default-spinner-container" }, /*#__PURE__*/
    React.createElement(FiLoader, { className: "set-default-spinner-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "set-default-spinner-text" }, "Setting as default...")
    ));

};

export default SetDefaultSpinner;