/**
 * SavedCard Component
 * 
 * Features:
 * - Displays saved card information
 * - Handles default card setting
 * - Card deletion functionality
 * - Loading states with appropriate spinners
 */

import React, { useState } from 'react';
import { FiMoreVertical, FiCheck, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useToast } from '../Toast/ToastContext';
import { PAYMENT_NOTIFICATIONS } from '../Toast/toastnotifications';
import './SavedCard.css';

const SavedCard = ({ card, onSetDefault, onDelete, cardImages }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const { showToast } = useToast();

  const getCardImage = (type) => {
    return cardImages[type.toLowerCase()] || cardImages.visa;
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(card.id);
    } catch (error) {
      console.error('Error deleting card:', error);
      showToast(error.message || PAYMENT_NOTIFICATIONS.CARD.DELETE.ERROR, 'error');
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    try {
      setIsSettingDefault(true);
      await onSetDefault(card.id);
    } catch (error) {
      console.error('Error setting default card:', error);
      showToast(error.message || PAYMENT_NOTIFICATIONS.CARD.SET_DEFAULT.ERROR, 'error');
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: `saved-card ${card.isDefault ? 'active' : ''}` }, /*#__PURE__*/
    React.createElement("div", { className: "saved-card-header" }, /*#__PURE__*/
    React.createElement("div", { className: "saved-card-brand-container" }, /*#__PURE__*/
    React.createElement("img", {
      src: getCardImage(card.type),
      alt: `${card.type} card`,
      className: "saved-card-brand-image" }
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "delete-container" },
    isDeleting ? /*#__PURE__*/
    React.createElement(LoadingSpinner, {
      color: "text-red-500",
      isDelete: true }
    ) : /*#__PURE__*/

    React.createElement("button", {
      onClick: handleDelete,
      className: "delete-saved-card-btn",
      title: card.isDefault ? "Delete default card" : "Delete card",
      disabled: isDeleting || isSettingDefault }, /*#__PURE__*/

    React.createElement(FiTrash2, null)
    )

    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "saved-card-body" }, /*#__PURE__*/
    React.createElement("div", { className: "saved-card-number" }, "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ",
    card.last4
    ), /*#__PURE__*/
    React.createElement("div", { className: "saved-card-details" }, /*#__PURE__*/
    React.createElement("div", { className: "saved-card-holder" }, card.cardHolder || 'Card Holder'), /*#__PURE__*/
    React.createElement("div", { className: "saved-card-expiry" }, "Expires ", card.expiry)
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "saved-card-actions" },
    !card.isDefault && /*#__PURE__*/
    React.createElement("button", {
      onClick: handleSetDefault,
      className: "set-default-btn",
      disabled: isSettingDefault || isDeleting },

    isSettingDefault ? /*#__PURE__*/
    React.createElement(LoadingSpinner, {
      color: "text-blue-500",
      isSetDefault: true }
    ) :

    'Set as default'

    )

    ),

    card.isDefault && /*#__PURE__*/
    React.createElement("div", { className: "default-badge-container" }, /*#__PURE__*/
    React.createElement("span", { className: "default-badge" }, /*#__PURE__*/
    React.createElement(FiCheck, { className: "badge-icon" }), "Default"

    )
    )

    ));

};

export default SavedCard;