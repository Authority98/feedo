/**
 * EnhanceWithAI Component
 * 
 * A reusable button component for AI text enhancement functionality
 * Features:
 * - Consistent styling across the application
 * - Loading state handling
 * - Disabled state when no text is present
 */

import React from 'react';
import { FiZap } from 'react-icons/fi';
import './EnhanceWithAI.css';

const EnhanceWithAI = ({ onClick, isDisabled, isLoading, text = "Rewrite AI" }) => {
  return (/*#__PURE__*/
    React.createElement("button", {
      type: "button",
      onClick: onClick,
      className: "enhance-btn",
      disabled: isDisabled || isLoading,
      title: "Enhance with AI" }, /*#__PURE__*/

    React.createElement(FiZap, { className: "w-3.5 h-3.5" }), /*#__PURE__*/
    React.createElement("span", null, text)
    ));

};

export default EnhanceWithAI;