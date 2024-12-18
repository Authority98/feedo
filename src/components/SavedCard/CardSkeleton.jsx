/**
 * CardSkeleton Component
 * 
 * Features:
 * - Displays animated loading state for saved cards
 * - Mimics the SavedCard layout
 * - Provides visual feedback during data fetching
 */

import React from 'react';
import './CardSkeleton.css';

const CardSkeleton = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "card-skeleton" }, /*#__PURE__*/

    React.createElement("div", { className: "skeleton-header" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-logo" })
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-body" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-number" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-details" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-text" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-text" })
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "skeleton-actions" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton-button" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton-icon" })
    )
    ));

};

export default CardSkeleton;