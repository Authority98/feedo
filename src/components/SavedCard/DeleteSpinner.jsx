/**
 * DeleteSpinner Component
 * 
 * Features:
 * - Specific spinner for delete action
 * - Matches delete button styling
 * - Compact size for delete button area
 */

import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './DeleteSpinner.css';

const DeleteSpinner = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "delete-spinner-container" }, /*#__PURE__*/
    React.createElement(FiLoader, { className: "delete-spinner-icon" })
    ));

};

export default DeleteSpinner;