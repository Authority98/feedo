/**
 * DataSubmissionSkeleton Component
 * 
 * Features:
 * - Matches exact layout and dimensions of DataSubmission
 * - Animated shimmer effects
 * - Staggered loading animations
 * - Responsive design
 */

import React from 'react';

const DataSubmissionSkeleton = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "skeleton-container data-submission" }, /*#__PURE__*/

    React.createElement("div", { className: "skeleton-data-header" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-data-title" })
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-profile-section" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-avatar-wrapper" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-avatar-container" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-avatar" }), /*#__PURE__*/

    React.createElement("div", { className: "skeleton-progress-ring" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-progress-circle" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-progress-pill" })
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-profile-info" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-profile-name" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-profile-type" })
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-submission-items" },
    [1, 2, 3, 4].map((item) => /*#__PURE__*/
    React.createElement("div", {
      key: item,
      className: "skeleton-submission-item",
      style: { animationDelay: `${item * 100}ms` } }, /*#__PURE__*/

    React.createElement("div", { className: "skeleton-item-content" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-status-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-item-text" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-item-title" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-item-label" })
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-chevron" })
    )
    )
    )
    ));

};

export default DataSubmissionSkeleton;