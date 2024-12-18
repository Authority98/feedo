import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../../../../../components/Button/Button';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ application, onConfirm, onCancel, isLoading }) => {
  if (!application) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "delete-modal-overlay", onClick: onCancel }, /*#__PURE__*/
    React.createElement("div", { className: "delete-modal-content", onClick: (e) => e.stopPropagation() }, /*#__PURE__*/
    React.createElement("div", { className: "delete-modal-icon" }, /*#__PURE__*/
    React.createElement(FiAlertTriangle, { className: "w-12 h-12 text-red-500" })
    ), /*#__PURE__*/

    React.createElement("h3", { className: "delete-modal-title" }, "Delete Application"), /*#__PURE__*/

    React.createElement("p", { className: "delete-modal-message" }, "Are you sure you want to delete ", /*#__PURE__*/
    React.createElement("span", { className: "font-semibold" }, application.name), "? This action cannot be undone."

    ), /*#__PURE__*/

    React.createElement("div", { className: "delete-modal-actions" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "outline",
      onClick: onCancel,
      disabled: isLoading,
      type: "button",
      className: "cancel-button" },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement(Button, {
      variant: "danger",
      onClick: onConfirm,
      isLoading: isLoading,
      type: "button",
      className: "delete-button" },
    "Delete Application"

    )
    )
    )
    ));

};

export default DeleteConfirmationModal;