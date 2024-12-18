/**
 * Payment Section Component
 * Features:
 * - Multiple payment methods management
 * - Card type detection and images
 * - Billing history
 * - Interactive card interface
 */

import React, { useState, useEffect } from 'react';
import {
  FiCreditCard, FiDollarSign, FiClock, FiDownload,
  FiPlus, FiTrash2, FiCheck } from
'react-icons/fi';
import './Payment.css';
import SavedCard from '../../../../../components/SavedCard/SavedCard';
import BillingHistory from '../../../../../components/BillingHistory/BillingHistory';
import AddCard from '../../../../../components/AddCard/AddCard';
import { stripeApi } from '../../../../../api/stripe';
import StripeProvider from '../../../../../api/providers/StripeProvider';
import { useToast } from '../../../../../components/Toast/ToastContext';
import SkeletonLoading from '../../../../../components/SkeletonLoading/SkeletonLoading';
import CardSkeleton from '../../../../../components/SavedCard/CardSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddCardPopup from '../../../../../components/Popups/AddCardPopup/AddCardPopup';
import { useAuth } from '../../../../../auth/AuthContext';
import { PAYMENT_NOTIFICATIONS } from '../../../../../components/Toast/toastnotifications';

// Move cardImages outside component
const cardImages = {
  visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
  mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
  amex: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
  discover: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
  unionpay: 'https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg',
  default: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg'
};

// eslint-disable-next-line no-unused-vars
const acceptedCardImages = {
  visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
  mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
  amex: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
  discover: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
  unionpay: 'https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg'
};

// Add this new component at the top level of the file
const EmptyPaymentMethods = () => /*#__PURE__*/
React.createElement("div", { className: "empty-payment-methods" }, /*#__PURE__*/
React.createElement(FiCreditCard, { className: "empty-icon" }), /*#__PURE__*/
React.createElement("p", { className: "empty-text" }, "No payment methods added"), /*#__PURE__*/
React.createElement("p", { className: "empty-subtext" }, "Add a payment method to get started")
);


const getCardImage = (type) => {


  const cardType = type?.toLowerCase() || 'default';




  return cardImages[cardType] || cardImages.default;
};

const Payment = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Check for showAddCard parameter
  useEffect(() => {
    const shouldShowAddCard = searchParams.get('showAddCard') === 'true';
    if (shouldShowAddCard) {
      setShowAddCardPopup(true);
    }
  }, [searchParams]);

  // Format payment method to card format
  const formatPaymentMethod = (paymentMethod, defaultPaymentMethodId) => {
    return {
      id: paymentMethod.id,
      type: paymentMethod.card.brand?.toLowerCase() || 'default',
      last4: paymentMethod.card.last4,
      expiry: `${String(paymentMethod.card.exp_month).padStart(2, '0')}/${String(paymentMethod.card.exp_year).slice(-2)}`,
      isDefault: paymentMethod.id === defaultPaymentMethodId,
      cardHolder: paymentMethod.billing_details.name || 'Card Holder'
    };
  };

  // Fetch or create customer
  const getOrCreateCustomer = async () => {
    try {
      if (!user) {
        throw new Error('Please sign in to manage payment methods');
      }

      // Get user ID from the transformed user object
      const userId = user.profile?.authUid;
      if (!userId) {
        console.error('User object:', user);
        throw new Error('Authentication error. Please try signing out and back in.');
      }

      // Get email from user data with fallbacks
      const userEmail = user.profile?.email || user.email;
      if (!userEmail) {
        throw new Error('Please complete your profile setup to add payment methods');
      }

      const customer = await stripeApi.getOrCreateCustomer(
        userId,
        userEmail
      );

      if (!customer || !customer.id) {
        throw new Error('Failed to create payment profile');
      }

      return customer.id;
    } catch (err) {
      console.error('Error getting/creating customer:', err);
      throw err;
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async (custId) => {
    try {

      const paymentMethods = await stripeApi.listPaymentMethods(custId);


      // Get the default payment method from Stripe
      const customer = await stripeApi.getCustomer(custId);
      const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method?.id;

      // Format cards and mark the default one
      const formattedCards = paymentMethods.map((pm) => {
        const formattedCard = formatPaymentMethod(pm, defaultPaymentMethodId);

        return formattedCard;
      });

      setCards(formattedCards);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      throw new Error('Failed to load payment methods');
    }
  };

  // Fetch billing history from Stripe
  const fetchBillingHistory = async (custId) => {
    try {
      setLoading(true);
      // Debug log

      // Get fresh billing history from Stripe
      const invoices = await stripeApi.getBillingHistory(custId);
      // Debug log

      // Update local state with new data
      setBillingHistory(invoices);
    } catch (error) {
      console.error('Error fetching billing history:', error);
      toast.showError('Failed to load billing history');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializePaymentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Wait for user data to be available
        if (!user) {

          return;
        }

        // Get or create customer first
        const custId = await getOrCreateCustomer();
        setCustomerId(custId);

        // Then fetch payment methods
        await fetchPaymentMethods(custId);

        // Fetch billing history
        await fetchBillingHistory(custId);
      } catch (err) {
        console.error('Error initializing payment data:', err);
        setError(err.message);
        toast.showError(err.message || 'Failed to initialize payment data');
      } finally {
        setLoading(false);
      }
    };

    initializePaymentData();
  }, [user]); // Depend on user object

  const handleSetDefault = async (cardId) => {
    try {
      await stripeApi.setDefaultPaymentMethod(customerId, cardId);
      await fetchPaymentMethods(customerId);
      toast.showToast(PAYMENT_NOTIFICATIONS.CARD.SET_DEFAULT.SUCCESS, 'success');
    } catch (err) {
      console.error('Error setting default card:', err);
      toast.showToast(PAYMENT_NOTIFICATIONS.CARD.SET_DEFAULT.ERROR, 'error');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await stripeApi.deletePaymentMethod(cardId);
      setCards(cards.filter((card) => card.id !== cardId));
      toast.showToast(PAYMENT_NOTIFICATIONS.CARD.DELETE.SUCCESS, 'success');
    } catch (err) {
      console.error('Error deleting card:', err);
      toast.showToast(PAYMENT_NOTIFICATIONS.CARD.DELETE.ERROR, 'error');
    }
  };

  const handleAddCard = async (paymentMethodId) => {
    try {
      await stripeApi.addPaymentMethod(customerId, paymentMethodId);
      await fetchPaymentMethods(customerId);
      toast.showToast(PAYMENT_NOTIFICATIONS.CARD.ADD.SUCCESS, 'success');
    } catch (err) {
      console.error('Error adding card:', err);
      toast.showToast(err.message || PAYMENT_NOTIFICATIONS.CARD.ADD.ERROR, 'error');
      throw err;
    }
  };

  const handleUpgradeClick = () => {
    navigate('/subscription');
  };

  // Update the handleClearHistory function
  const handleClearHistory = async () => {
    try {
      if (!user) return;

      // Show confirmation dialog
      if (window.confirm('Are you sure you want to clear your billing history? This cannot be undone.')) {
        setLoading(true); // Add loading state while clearing

        // Clear billing history in Stripe
        await stripeApi.clearBillingHistory(customerId);

        // Refresh billing history from Stripe
        await fetchBillingHistory(customerId);

        // Show success message
        toast.showSuccess('Billing history cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing billing history:', error);
      toast.showError('Failed to clear billing history');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "p-4 bg-red-50 text-red-600 rounded-lg" }, /*#__PURE__*/
      React.createElement("h3", { className: "font-semibold" }, "Error"), /*#__PURE__*/
      React.createElement("p", null, error)
      ));

  }

  if (loading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "payment-section" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-state" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-spinner" })
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "payment-section" }, /*#__PURE__*/
    React.createElement("div", { className: "section-header" }, /*#__PURE__*/
    React.createElement("div", { className: "header-content" }, /*#__PURE__*/
    React.createElement("div", { className: "title-container" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, /*#__PURE__*/
    React.createElement(FiCreditCard, { className: "section-icon" }), "Payment Methods & Billing"

    ), /*#__PURE__*/
    React.createElement("p", { className: "section-subtitle" }, "Manage your payment methods and view billing history"

    )
    ), /*#__PURE__*/
    React.createElement("button", {
      className: "upgrade-plan-btn",
      onClick: () => setShowAddCardPopup(true) }, /*#__PURE__*/

    React.createElement(FiPlus, { className: "upgrade-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Add New Card")
    )
    )
    ), /*#__PURE__*/

    React.createElement(StripeProvider, null, /*#__PURE__*/

    React.createElement("div", { className: "payment-methods" }, /*#__PURE__*/
    React.createElement("div", { className: "subsection-header" }, /*#__PURE__*/
    React.createElement("h3", { className: "subsection-title" }, "Payment Methods")
    ),

    loading ? /*#__PURE__*/
    React.createElement("div", { className: "cards-list" }, /*#__PURE__*/
    React.createElement(CardSkeleton, null), /*#__PURE__*/
    React.createElement(CardSkeleton, null)
    ) :
    cards.length === 0 ? /*#__PURE__*/
    React.createElement(EmptyPaymentMethods, null) : /*#__PURE__*/

    React.createElement("div", { className: "cards-list" },
    cards.map((card) => /*#__PURE__*/
    React.createElement(SavedCard, {
      key: card.id,
      card: card,
      onSetDefault: handleSetDefault,
      onDelete: handleDeleteCard,
      cardImages: cardImages }
    )
    )
    )

    ), /*#__PURE__*/


    React.createElement(BillingHistory, {
      invoices: billingHistory,
      onClearHistory: handleClearHistory,
      loading: loading }
    ), /*#__PURE__*/


    React.createElement(AddCardPopup, {
      isOpen: showAddCardPopup,
      onClose: () => setShowAddCardPopup(false),
      onAddCard: handleAddCard }
    )
    )
    ));

};

export default Payment;