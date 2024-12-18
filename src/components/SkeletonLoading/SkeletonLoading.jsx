/**
 * SkeletonLoading Component
 * 
 * Features:
 * - Central component for managing different skeleton types
 * - Imports specific skeleton components based on variant
 * - Provides consistent loading experience
 */

import React from 'react';
import './SkeletonLoading.css';
import DataSubmissionSkeleton from './skeletons/DataSubmissionSkeleton';
import RecentActivitySkeleton from './skeletons/RecentActivitySkeleton';

const SkeletonLoading = ({ variant = 'payment' }) => {
  // Return appropriate skeleton based on variant
  switch (variant) {
    case 'data-submission':
      return /*#__PURE__*/React.createElement(DataSubmissionSkeleton, null);
    case 'recent-activity':
      return /*#__PURE__*/React.createElement(RecentActivitySkeleton, null);
    default:
      return (/*#__PURE__*/
        React.createElement("div", { className: "skeleton-container" }, /*#__PURE__*/

        React.createElement("div", { className: "skeleton-header" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-title-group" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-title" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-subtitle" })
        ), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-button" })
        ), /*#__PURE__*/

        React.createElement("div", { className: "skeleton-cards" },
        [1, 2].map((item) => /*#__PURE__*/
        React.createElement("div", { key: item, className: "skeleton-card" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-card-logo" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-card-number" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-card-details" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-text-short" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-text-short" })
        ), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-card-actions" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-button-small" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-button-icon" })
        )
        )
        )
        ), /*#__PURE__*/

        React.createElement("div", { className: "skeleton-billing" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-billing-title" }),
        [1, 2, 3].map((item) => /*#__PURE__*/
        React.createElement("div", { key: item, className: "skeleton-billing-item" }, /*#__PURE__*/
        React.createElement("div", { className: "skeleton-text-medium" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-text-short" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-text-short" }), /*#__PURE__*/
        React.createElement("div", { className: "skeleton-button-small" })
        )
        )
        )
        ));

  }
};

export default SkeletonLoading;