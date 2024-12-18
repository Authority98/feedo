import React from 'react';
import { FiX } from 'react-icons/fi';
import './CloseButton.css';

const CloseButton = ({ onClick, className = '', position = 'right' }) => {
  return (/*#__PURE__*/
    React.createElement("button", {
      className: `panel-close-button ${position} ${className}`,
      onClick: onClick,
      "aria-label": "Close panel" }, /*#__PURE__*/

    React.createElement(FiX, { className: "w-5 h-5" })
    ));

};

export default CloseButton;