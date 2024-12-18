/**
 * PaymentOptionsPopup Component
 * 
 * Features:
 * - Shows saved cards for payment
 * - Option to add new card
 * - Handles payment selection
 * - Animated transitions
 * 
 * Props:
 * @param {boolean} isOpen - Controls popup visibility
 * @param {function} onClose - Handler for closing the popup
 * @param {Array} savedCards - List of saved payment methods
 * @param {function} onSelectCard - Handler for card selection
 * @param {function} onAddNewCard - Handler for adding new card
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus } from 'react-icons/fi';
import PaymentProcessingSpinner from './PaymentProcessingSpinner';
import './PaymentOptionsPopup.css';

// Update the cardImages object to match Payment section
const cardImages = {
  visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
  mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
  amex: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
  discover: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
  unionpay: 'https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg',
  default: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg'
};

// Update the getCardImage function to be more robust
const getCardImage = (type) => {
  const cardType = type?.toLowerCase() || 'default';
  return cardImages[cardType] || cardImages.default;
};

const PaymentOptionsPopup = ({
  isOpen,
  onClose,
  savedCards = [],
  onSelectCard,
  onAddNewCard
}) => {
  const [processingCardId, setProcessingCardId] = useState(null);

  const handleCardSelection = async (card) => {
    try {
      setProcessingCardId(card.id);
      await onSelectCard(card);
    } catch (error) {
      console.error('Error processing card selection:', error);
    } finally {
      setProcessingCardId(null);
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

    React.createElement("div", { className: "payment-options-container" }, /*#__PURE__*/
    React.createElement("div", { className: "popup-header" }, /*#__PURE__*/
    React.createElement("h3", null, "Choose Payment Method"), /*#__PURE__*/
    React.createElement("button", { onClick: onClose, className: "close-btn" }, /*#__PURE__*/
    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "saved-cards-list" },
    savedCards.map((card) => /*#__PURE__*/
    React.createElement("button", {
      key: card.id,
      className: `saved-card-option ${processingCardId === card.id ? 'processing' : ''}`,
      onClick: () => handleCardSelection(card),
      disabled: processingCardId !== null },

    processingCardId === card.id ? /*#__PURE__*/
    React.createElement(PaymentProcessingSpinner, null) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("img", {
      src: getCardImage(card.type),
      alt: `${card.type} card`,
      className: "card-brand-image" }
    ), /*#__PURE__*/
    React.createElement("div", { className: "card-details" }, /*#__PURE__*/
    React.createElement("span", { className: "card-name" }, card.cardHolder), /*#__PURE__*/
    React.createElement("span", { className: "card-number" }, "\u2022\u2022\u2022\u2022 ", card.last4)
    ),
    card.isDefault && /*#__PURE__*/
    React.createElement("span", { className: "default-badge" }, "Default")

    )

    )
    ), /*#__PURE__*/

    React.createElement("button", {
      className: "add-new-card-btn",
      onClick: onAddNewCard,
      disabled: processingCardId !== null }, /*#__PURE__*/

    React.createElement(FiPlus, { className: "add-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Add New Card")
    )
    )
    )
    )
    )

    ));

};

export default PaymentOptionsPopup;