/**
 * ConfirmationModal Component
 * 
 * Features:
 * - Reusable confirmation dialog
 * - Customizable message and actions
 * - Consistent styling
 */

import React from 'react';
import AdminButton from '../../AdminButton/AdminButton';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "confirmation-overlay" }, /*#__PURE__*/
    React.createElement("div", { className: "confirmation-modal" }, /*#__PURE__*/
    React.createElement("div", { className: "confirmation-header" }, /*#__PURE__*/
    React.createElement("h3", null, title)
    ), /*#__PURE__*/
    React.createElement("div", { className: "confirmation-body" }, /*#__PURE__*/
    React.createElement("p", { className: "confirmation-message" }, message)
    ), /*#__PURE__*/
    React.createElement("div", { className: "confirmation-footer" }, /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "outline",
      onClick: onClose },

    cancelText
    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "danger",
      onClick: () => {
        onConfirm();
        onClose();
      } },

    confirmText
    )
    )
    )
    ));

};

export default ConfirmationModal;