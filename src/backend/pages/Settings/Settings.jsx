/**
 * Settings Page Component
 * Features:
 * - User profile settings
 * - Account preferences
 * - Payment settings
 * - Notification settings
 * - Privacy controls
 * - Two-Step Authentication
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Profile from './sections/Profile/Profile';
import Account from './sections/Account/Account';
import PaymentSection from './sections/Payment';
import Notification from './sections/Notification/Notification';
import TwoStepSection from './sections/TwoStep';
import './Settings.css';

const SettingsContent = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('account');

  // Handle URL parameters for active section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return /*#__PURE__*/React.createElement(Account, null);
      case 'payment':
        return /*#__PURE__*/React.createElement(PaymentSection, null);
      case 'notification':
        return /*#__PURE__*/React.createElement(Notification, null);
      case 'two-step':
        return /*#__PURE__*/React.createElement(TwoStepSection, null);
      default:
        return /*#__PURE__*/React.createElement(Account, null);
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "settings-page" }, /*#__PURE__*/
    React.createElement("div", { className: "settings-content" }, /*#__PURE__*/
    React.createElement("div", { className: "settings-layout" }, /*#__PURE__*/
    React.createElement(Profile, {
      activeSection: activeSection,
      onSectionChange: setActiveSection }
    ),
    renderSection()
    )
    )
    ));

};

const Settings = () => {
  return /*#__PURE__*/React.createElement(SettingsContent, null);
};

export default Settings;