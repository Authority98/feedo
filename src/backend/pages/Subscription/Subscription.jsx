/**
 * Subscription Page Component
 * 
 * Features:
 * - Main container for subscription functionality
 * - Imports and renders the SubscriptionSection component
 * - Handles layout and structure for subscription page
 * - Prepared for additional subscription-related sections
 */

import React from 'react';
import { ToastProvider } from '../../../components/Toast/ToastContext';
import SubscriptionSection from './sections/SubscriptionSection';
import './Subscription.css';

const Subscription = () => {
  return (/*#__PURE__*/
    React.createElement(ToastProvider, null, /*#__PURE__*/
    React.createElement("div", { className: "subscription-page" }, /*#__PURE__*/
    React.createElement(SubscriptionSection, null)
    )
    ));

};

export default Subscription;