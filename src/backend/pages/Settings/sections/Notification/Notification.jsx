/**
 * Notification Settings Section Component
 * Features:
 * - Email notification preferences
 * - Push notification settings
 */

import React, { useState } from 'react';
import {
  FiBell,
  FiMail } from
'react-icons/fi';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true
  });

  const handleToggle = (category) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const NotificationToggle = ({ enabled, onClick }) => /*#__PURE__*/
  React.createElement("button", {
    onClick: onClick,
    className: `toggle-button ${enabled ? 'active' : ''}`,
    "aria-checked": enabled,
    role: "switch" }
  );


  return (/*#__PURE__*/
    React.createElement("div", { className: "notification-section" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, /*#__PURE__*/
    React.createElement(FiBell, { className: "section-icon" }), "Notification Settings"

    ), /*#__PURE__*/


    React.createElement("div", { className: "notification-group" }, /*#__PURE__*/
    React.createElement("h3", { className: "subsection-title" }, "General Settings"), /*#__PURE__*/

    React.createElement("div", { className: "settings-list" }, /*#__PURE__*/
    React.createElement("div", { className: "setting-item" }, /*#__PURE__*/
    React.createElement("div", { className: "setting-info" }, /*#__PURE__*/
    React.createElement("div", { className: "setting-icon" }, /*#__PURE__*/
    React.createElement(FiMail, null)
    ), /*#__PURE__*/
    React.createElement("div", { className: "setting-details" }, /*#__PURE__*/
    React.createElement("h4", null, "Email Notifications"), /*#__PURE__*/
    React.createElement("p", null, "Receive notifications via email")
    )
    ), /*#__PURE__*/
    React.createElement(NotificationToggle, {
      enabled: notifications.emailNotifications,
      onClick: () => handleToggle('emailNotifications') }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "setting-item" }, /*#__PURE__*/
    React.createElement("div", { className: "setting-info" }, /*#__PURE__*/
    React.createElement("div", { className: "setting-icon" }, /*#__PURE__*/
    React.createElement(FiBell, null)
    ), /*#__PURE__*/
    React.createElement("div", { className: "setting-details" }, /*#__PURE__*/
    React.createElement("h4", null, "Push Notifications"), /*#__PURE__*/
    React.createElement("p", null, "Receive notifications in your browser")
    )
    ), /*#__PURE__*/
    React.createElement(NotificationToggle, {
      enabled: notifications.pushNotifications,
      onClick: () => handleToggle('pushNotifications') }
    )
    )
    )
    )
    ));

};

export default Notification;