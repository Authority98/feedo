/**
 * AdminDashboard Component
 * 
 * Features:
 * - Welcoming message
 * - Time-based greeting
 * - Motivational quote
 * - Clean and friendly design
 */

import React from 'react';
import { FiSun, FiMoon, FiSunrise } from 'react-icons/fi';
import { useAdminAuth } from '../AdminAuth/AdminAuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: FiSunrise };
    if (hour < 18) return { text: 'Good Afternoon', icon: FiSun };
    return { text: 'Good Evening', icon: FiMoon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const getRandomQuote = () => {
    const quotes = [
    "Today is a great day to make a difference!",
    "Your dedication makes our platform better every day.",
    "Small steps lead to big changes.",
    "Together, we're building something amazing!",
    "Your work matters and impacts many lives."];

    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "admin-dashboard" }, /*#__PURE__*/
    React.createElement("div", { className: "welcome-card" }, /*#__PURE__*/
    React.createElement("div", { className: "welcome-header" }, /*#__PURE__*/
    React.createElement(GreetingIcon, { className: "greeting-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "welcome-text" }, /*#__PURE__*/
    React.createElement("h1", null, greeting.text, ", Admin!"), /*#__PURE__*/
    React.createElement("p", { className: "admin-email" }, adminUser?.email)
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "welcome-message" }, /*#__PURE__*/
    React.createElement("p", { className: "message-text" }, "Welcome to your dashboard! We're glad to have you here."), /*#__PURE__*/
    React.createElement("p", { className: "daily-quote" }, getRandomQuote())
    )
    )
    ));

};

export default AdminDashboard;