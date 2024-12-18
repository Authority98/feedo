/**
 * TwoStep Section Index
 * 
 * Features:
 * - Wraps TwoStep component with required providers
 * - Handles toast notifications
 */

import React from 'react';
import { ToastProvider } from '../../../../../components/Toast/ToastContext';
import TwoStep from './TwoStep';

const TwoStepSection = () => {
  return (/*#__PURE__*/
    React.createElement(ToastProvider, null, /*#__PURE__*/
    React.createElement(TwoStep, null)
    ));

};

export default TwoStepSection;