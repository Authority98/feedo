/**
 * OpportunityDetails Component
 * 
 * Features:
 * - Displays detailed information about an opportunity
 * - Uses formatted date and currency values
 * - Shows save status and loading states
 */

import React from 'react';
import { FiCalendar, FiHeart, FiX } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import AnimatedPercentage from '../../../../../components/Animated/AnimatedPercentage';
import './OpportunityDetails.css';

const OpportunityDetails = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  // Helper function to ensure progress values are valid numbers
  const getValidProgress = (value) => {
    const progress = Number(value);
    return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "opportunity-details-page" }, /*#__PURE__*/

    React.createElement("div", { className: "details-header" }, /*#__PURE__*/
    React.createElement("h1", { className: "page-title" }, opportunity.title), /*#__PURE__*/

    React.createElement("div", { className: "opportunity-action-btns" }, /*#__PURE__*/
    React.createElement("button", { className: "opportunity-btn" }, /*#__PURE__*/
    React.createElement(FiCalendar, null), "Calendar"

    ), /*#__PURE__*/
    React.createElement("button", {
      className: `opportunity-btn--save ${opportunity.isSaved ? 'saved' : ''}`,
      onClick: opportunity.onSave,
      disabled: opportunity.isLoading,
      "aria-label": opportunity.isSaved ? 'Unsave opportunity' : 'Save opportunity' },

    opportunity.isSaved ? /*#__PURE__*/React.createElement(FaHeart, null) : /*#__PURE__*/React.createElement(FiHeart, null),
    opportunity.isSaved ? 'Saved' : 'Save'
    ), /*#__PURE__*/
    React.createElement("button", { className: "opportunity-btn--primary" }, "Apply Now")
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "progress-section" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-item" }, /*#__PURE__*/
    React.createElement("label", null, "Deadline"), /*#__PURE__*/
    React.createElement("span", null, opportunity.formattedDeadline)
    ), /*#__PURE__*/
    React.createElement("div", { className: "progress-item" }, /*#__PURE__*/
    React.createElement("label", null, "Application Progress"), /*#__PURE__*/
    React.createElement("div", { className: "progress-container" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-bar application" }, /*#__PURE__*/
    React.createElement("div", {
      className: "progress-fill",
      style: { '--target-width': `${getValidProgress(opportunity.applicationProgress)}%` } }
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: "progress-text" },
    getValidProgress(opportunity.applicationProgress), "%"
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "progress-item" }, /*#__PURE__*/
    React.createElement("label", null, "Match Percentage"), /*#__PURE__*/
    React.createElement("div", { className: "progress-container" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-bar match" }, /*#__PURE__*/
    React.createElement("div", {
      className: "progress-fill",
      style: { '--target-width': `${getValidProgress(opportunity.matchPercentage)}%` } }
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: "progress-text" },
    getValidProgress(opportunity.matchPercentage), "%"
    )
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "details-content" }, /*#__PURE__*/

    React.createElement("div", { className: "description-section" }, /*#__PURE__*/
    React.createElement("h2", null, "Description"), /*#__PURE__*/
    React.createElement("p", null, opportunity.description)
    ), /*#__PURE__*/


    React.createElement("div", { className: "requirements-section" }, /*#__PURE__*/
    React.createElement("h2", null, "Requirements"), /*#__PURE__*/
    React.createElement("ul", null,
    opportunity.requirements?.map((req, index) => /*#__PURE__*/
    React.createElement("li", { key: index }, req)
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "location-section" }, /*#__PURE__*/
    React.createElement("h2", null, "Location"), /*#__PURE__*/
    React.createElement("p", null,
    opportunity.location?.type === 'remote' ? 'Remote' :
    `${opportunity.location?.city}, ${opportunity.location?.country}`
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "compensation-section" }, /*#__PURE__*/
    React.createElement("h2", null, "Compensation"), /*#__PURE__*/
    React.createElement("p", null, opportunity.formattedSalary)
    )
    )
    ));

};

export default OpportunityDetails;