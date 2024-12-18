/**
 * Support Section Component
 * 
 * A comprehensive support interface that provides:
 * - Multiple contact options (request, email, chat)
 * - Interactive button animations
 * - Response time tracking
 * - Visual feedback
 * - Responsive design
 */

import React, { useState } from 'react';
import {
  FiBookmark, // For new request button
  FiMail, // For email contact button
  FiMessageSquare // For live chat button
} from 'react-icons/fi';
import { faqGirl } from '../../../../../assets';
import AnimatedNumber from '../../../../../components/Animated/AnimatedNumber';
import EmailDialog from '../../../../../components/EmailDialog/EmailDialog';
import './Support.css';

const Support = () => {
  /**
   * State Management
   */
  const [activeButton, setActiveButton] = useState(null); // Tracks active button for hover effects
  const [responseTime] = useState(5); // Average response time in minutes
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  /**
   * Handle button hover effects
   * Updates active button state for enhanced visual feedback
   * @param {string} buttonId - ID of hovered button
   */
  const handleButtonHover = (buttonId) => {
    setActiveButton(buttonId);
  };

  /**
   * Handle button hover end
   * Resets active button state
   */
  const handleButtonLeave = () => {
    setActiveButton(null);
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "support-section" }, /*#__PURE__*/

    React.createElement("div", { className: "support-content" }, /*#__PURE__*/

    React.createElement("h2", { className: "support-title animate-slide-in" }, "Can't Find What You're Looking For?"

    ), /*#__PURE__*/
    React.createElement("p", { className: "support-subtitle animate-fade-in" }, "We're here to help \u2022 Average response time: ", /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: responseTime }), " minutes"
    ), /*#__PURE__*/


    React.createElement("div", { className: "support-actions" }, /*#__PURE__*/

    React.createElement("button", {
      className: `support-btn create ${activeButton === 'create' ? 'active' : ''}`,
      onMouseEnter: () => handleButtonHover('create'),
      onMouseLeave: handleButtonLeave }, /*#__PURE__*/

    React.createElement(FiBookmark, { className: "btn-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "btn-text" }, "Create New Request"), /*#__PURE__*/
    React.createElement("div", { className: "btn-shine" })
    ), /*#__PURE__*/


    React.createElement("button", {
      className: `support-btn email ${activeButton === 'email' ? 'active' : ''}`,
      onMouseEnter: () => handleButtonHover('email'),
      onMouseLeave: handleButtonLeave,
      onClick: () => setIsEmailDialogOpen(true) }, /*#__PURE__*/

    React.createElement(FiMail, { className: "btn-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "btn-text" }, "Contact with Email"), /*#__PURE__*/
    React.createElement("div", { className: "btn-shine" })
    ), /*#__PURE__*/


    React.createElement("button", {
      className: `support-btn chat ${activeButton === 'chat' ? 'active' : ''}`,
      onMouseEnter: () => handleButtonHover('chat'),
      onMouseLeave: handleButtonLeave,
      onClick: () => window.$crisp.push(['do', 'chat:open']) }, /*#__PURE__*/

    React.createElement(FiMessageSquare, { className: "btn-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "btn-text" }, "Contact with Live chat"), /*#__PURE__*/
    React.createElement("div", { className: "btn-shine" })
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "support-image" }, /*#__PURE__*/
    React.createElement("img", {
      src: faqGirl,
      alt: "Support Representative" }
    )
    ), /*#__PURE__*/


    React.createElement(EmailDialog, {
      open: isEmailDialogOpen,
      onClose: () => setIsEmailDialogOpen(false) }
    )
    ));

};

/**
 * Export the Support component
 * This component provides:
 * - Multiple contact options
 * - Interactive animations
 * - Response time tracking
 * - Visual feedback
 * - Responsive design
 */
export default Support;