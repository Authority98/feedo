/**
 * PaymentProcessingSpinner Component
 * 
 * Features:
 * - Specific spinner for payment processing
 * - Matches payment options styling
 * - Animated loading state
 */

import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './PaymentProcessingSpinner.css';

const PaymentProcessingSpinner = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "payment-processing-spinner" }, /*#__PURE__*/
    React.createElement(FiLoader, { className: "spinner-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "spinner-text" }, "Processing payment")
    ));

};

export default PaymentProcessingSpinner;