/**
 * Stripe Provider Component
 * 
 * Features:
 * - Initializes Stripe with public key from API
 * - Provides Stripe context to child components
 * - Handles Stripe Elements initialization
 * - Error handling for missing configuration
 */

import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripeApi, getStripePromise } from '../stripe';
import { stripeConfig } from '../config/stripe.config';

const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setLoading(true);

        if (!stripeConfig.isConfigured) {
          throw new Error('Stripe configuration is missing or invalid');
        }

        const promise = await getStripePromise();
        setStripePromise(promise);
      } catch (err) {
        console.error('Stripe initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  if (loading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "flex items-center justify-center p-4" }, "Loading payment system..."

      ));

  }

  if (error) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "p-4 bg-red-50 text-red-600 rounded-lg" }, /*#__PURE__*/
      React.createElement("h3", { className: "font-semibold" }, "Configuration Error"), /*#__PURE__*/
      React.createElement("p", null, error), /*#__PURE__*/
      React.createElement("p", { className: "text-sm mt-2" }, "Please check your Stripe configuration.")
      ));

  }

  const options = {
    fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    }]

  };

  return (/*#__PURE__*/
    React.createElement(Elements, { stripe: stripePromise, options: options },
    children
    ));

};

export default StripeProvider;