import React from 'react';
import { FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import CloseButton from '../../../../../components/CloseButton/CloseButton';
import StatusBadge from '../../../../../components/StatusBadge/StatusBadge';
import './ApplicationPanel.css';

const ApplicationPanel = ({ isOpen, onClose, application }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "application-panel-overlay", onClick: onClose }, /*#__PURE__*/
    React.createElement("div", { className: "application-panel", onClick: (e) => e.stopPropagation() }, /*#__PURE__*/
    React.createElement(CloseButton, { onClick: onClose, position: "right" }), /*#__PURE__*/

    React.createElement("div", { className: "panel-content" }, /*#__PURE__*/
    React.createElement("div", { className: "panel-header" }, /*#__PURE__*/
    React.createElement("h2", { className: "panel-title" }, application.name), /*#__PURE__*/
    React.createElement(StatusBadge, {
      status: application.status,
      variant: "application" }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "panel-section" }, /*#__PURE__*/
    React.createElement("h3", { className: "section-title" }, "Details"), /*#__PURE__*/
    React.createElement("div", { className: "details-grid" }, /*#__PURE__*/
    React.createElement("div", { className: "detail-item" }, /*#__PURE__*/
    React.createElement(FiCalendar, { className: "detail-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "detail-content" }, /*#__PURE__*/
    React.createElement("span", { className: "detail-label" }, "Submission Date"), /*#__PURE__*/
    React.createElement("span", { className: "detail-value" }, formatDate(application.submissionDate))
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "detail-item" }, /*#__PURE__*/
    React.createElement(FiClock, { className: "detail-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "detail-content" }, /*#__PURE__*/
    React.createElement("span", { className: "detail-label" }, "Deadline"), /*#__PURE__*/
    React.createElement("span", { className: "detail-value" }, formatDate(application.deadline))
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "detail-item" }, /*#__PURE__*/
    React.createElement(FiFileText, { className: "detail-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "detail-content" }, /*#__PURE__*/
    React.createElement("span", { className: "detail-label" }, "Category"), /*#__PURE__*/
    React.createElement("span", { className: "detail-value" }, application.category)
    )
    )
    )
    ),

    application.description && /*#__PURE__*/
    React.createElement("div", { className: "panel-section" }, /*#__PURE__*/
    React.createElement("h3", { className: "section-title" }, "Description"), /*#__PURE__*/
    React.createElement("p", { className: "description-text" }, application.description)
    ),


    application.notes && /*#__PURE__*/
    React.createElement("div", { className: "panel-section" }, /*#__PURE__*/
    React.createElement("h3", { className: "section-title" }, "Notes"), /*#__PURE__*/
    React.createElement("p", { className: "notes-text" }, application.notes)
    ),


    application.feedback && /*#__PURE__*/
    React.createElement("div", { className: "panel-section" }, /*#__PURE__*/
    React.createElement("h3", { className: "section-title" }, "Feedback"), /*#__PURE__*/
    React.createElement("p", { className: "feedback-text" }, application.feedback)
    ), /*#__PURE__*/


    React.createElement("div", { className: "panel-section mt-auto" }, /*#__PURE__*/
    React.createElement("button", {
      className: "apply-now-btn w-full",
      onClick: () => window.open(application.applyUrl || '#', '_blank'),
      style: { backgroundColor: '#246BFD', color: 'white' } },
    "Apply Now"

    )
    )
    )
    )
    ));

};

export default ApplicationPanel;