/**
 * HelpCenter Component
 * 
 * A comprehensive help center interface that provides:
 * - FAQ section with expandable questions
 * - Support options with contact methods
 * - Responsive side-by-side layout
 * - Interactive animations and transitions
 * - Real-time response time tracking
 * 
 * Layout Structure:
 * - Left Column: FAQ section with expandable items
 * - Right Column: Support options with contact buttons
 */

import React from 'react';

// Section component imports
import FAQ from './sections/FAQ/FAQ'; // FAQ accordion component
import Support from './sections/Support/Support'; // Support options component

// Styles import
import './HelpCenter.css';

const HelpCenter = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "help-center-page" }, /*#__PURE__*/
    React.createElement("div", { className: "page-content" }, /*#__PURE__*/

    React.createElement("div", { className: "left-column" }, /*#__PURE__*/
    React.createElement(FAQ, null)
    ), /*#__PURE__*/


    React.createElement("div", { className: "right-column" }, /*#__PURE__*/
    React.createElement(Support, null)
    )
    )
    ));

};

/**
 * Export the HelpCenter component
 * This component provides:
 * - Organized help content in FAQ format
 * - Multiple support contact options
 * - Responsive layout that stacks on mobile
 * - Smooth animations for better UX
 * - Real-time support status indicators
 */
export default HelpCenter;