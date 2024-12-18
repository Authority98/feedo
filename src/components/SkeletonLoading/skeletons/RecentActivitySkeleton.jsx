/**
 * RecentActivitySkeleton Component
 * 
 * Features:
 * - Matches exact layout and dimensions of RecentActivity
 * - Staggered loading animations
 * - Shimmer effects
 * - Responsive design
 */

import React from 'react';

const RecentActivitySkeleton = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "skeleton-container recent-activity" }, /*#__PURE__*/

    React.createElement("div", { className: "skeleton-activity-header" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-title" })
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-activity-list" },
    [1, 2, 3].map((item) => /*#__PURE__*/
    React.createElement("div", {
      key: item,
      className: "skeleton-activity-item",
      style: { animationDelay: `${item * 150}ms` } }, /*#__PURE__*/


    React.createElement("div", { className: "skeleton-activity-icon-wrapper" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-status" })
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-activity-content" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-text" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-type" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-description" })
    ), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-activity-button" })
    )
    )
    )
    )
    ));

};

export default RecentActivitySkeleton;