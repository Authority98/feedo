/**
 * AddCard Component
 * 
 * Features:
 * - Displays add new card button
 * - Shows card input form when clicked
 * - Handles card validation and submission
 * - Responsive design
 * 
 * Props:
 * @param {Function} onAddCard - Handler for adding new card
 * @param {boolean} initialShowForm - Whether to show the form initially
 * @param {Function} onCancel - Handler for canceling the form
 * @param {boolean} hideDefaultView - Whether to hide the default view
 * @param {boolean} hideHeader - Whether to hide the header
 */

import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiLoader } from 'react-icons/fi';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './AddCard.css';
import { cardImages } from '../../assets';

const AddCard = ({
  onAddCard,
  initialShowForm = false,
  onCancel,
  hideDefaultView = false,
  hideHeader = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showForm, setShowForm] = useState(initialShowForm);
  const [cardHolderName, setCardHolderName] = useState('');

  // Use effect to handle initialShowForm changes
  useEffect(() => {
    setShowForm(initialShowForm);
  }, [initialShowForm]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !cardHolderName.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardHolderName.trim()
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      await onAddCard(paymentMethod.id);
      elements.getElement(CardElement).clear();
      setCardHolderName('');
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add card. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!showForm && hideDefaultView) {
    return null;
  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "add-card-container" }, /*#__PURE__*/
    React.createElement("div", { className: "card-form" },
    !hideHeader && /*#__PURE__*/
    React.createElement("div", { className: "form-header" }, /*#__PURE__*/
    React.createElement("h3", null, "Add New Card"), /*#__PURE__*/
    React.createElement("button", {
      onClick: () => setShowForm(false),
      className: "close-btn" }, /*#__PURE__*/

    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "cardHolderName", className: "form-label" }, "Cardholder Name"

    ), /*#__PURE__*/
    React.createElement("input", {
      id: "cardHolderName",
      type: "text",
      value: cardHolderName,
      onChange: (e) => setCardHolderName(e.target.value),
      className: "form-input",
      placeholder: "Enter cardholder name",
      required: true }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "stripe-element-container" }, /*#__PURE__*/
    React.createElement(CardElement, {
      options: {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#9e2146'
          }
        }
      } }
    )
    ),
    error && /*#__PURE__*/React.createElement("div", { className: "error-message" }, error), /*#__PURE__*/
    React.createElement("div", { className: "form-actions" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      onClick: () => {
        setShowForm(false);
        if (onCancel) onCancel();
      },
      className: "cancel-btn",
      disabled: processing },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement("button", {
      type: "submit",
      disabled: !stripe || processing || !cardHolderName.trim(),
      className: "submit-btn" },

    processing ? /*#__PURE__*/
    React.createElement("span", { className: "submit-btn-content" }, /*#__PURE__*/
    React.createElement(FiLoader, { className: "spinner-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Adding...")
    ) :

    'Add Card'

    )
    )
    )
    )
    ));

};

export default AddCard;