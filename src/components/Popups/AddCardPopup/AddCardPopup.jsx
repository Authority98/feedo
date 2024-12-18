/**
 * AddCardPopup Component
 * 
 * Features:
 * - Modal overlay for adding new cards
 * - Reusable across different pages
 * - Animated entrance/exit
 * - Backdrop click handling
 * 
 * Props:
 * @param {boolean} isOpen - Controls popup visibility
 * @param {function} onClose - Handler for closing the popup
 * @param {function} onAddCard - Handler for adding a new card
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddCard from '../../AddCard/AddCard';
import './AddCardPopup.css';
import { FiX } from 'react-icons/fi';

const AddCardPopup = ({ isOpen, onClose, onAddCard }) => {
  const handleAddCard = async (paymentMethodId) => {
    try {
      await onAddCard(paymentMethodId);
      onClose();
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  return (/*#__PURE__*/
    React.createElement(AnimatePresence, null,
    isOpen && /*#__PURE__*/
    React.createElement(motion.div, {
      className: "popup-overlay",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 } }, /*#__PURE__*/

    React.createElement(motion.div, {
      className: "popup-content",
      initial: { scale: 0.95, opacity: 0, y: 20 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.95, opacity: 0, y: 20 },
      transition: { type: "spring", duration: 0.3 } }, /*#__PURE__*/

    React.createElement("div", { className: "card-form" }, /*#__PURE__*/
    React.createElement("div", { className: "form-header" }, /*#__PURE__*/
    React.createElement("h3", null, "Add New Card"), /*#__PURE__*/
    React.createElement("button", {
      onClick: onClose,
      className: "close-btn" }, /*#__PURE__*/

    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/
    React.createElement(AddCard, {
      onAddCard: handleAddCard,
      initialShowForm: true,
      onCancel: onClose,
      hideDefaultView: true,
      hideHeader: true }
    )
    )
    )
    )

    ));

};

export default AddCardPopup;