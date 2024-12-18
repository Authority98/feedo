/**
 * BillingHistory Component
 * 
 * Features:
 * - Displays billing history in a list format
 * - Shows invoice details, amount, status
 * - Download invoice functionality
 * - Empty state message
 * - Clear history option
 * - Responsive design
 * 
 * Props:
 * @param {Array} invoices - List of invoice records
 * @param {Function} onClearHistory - Handler for clearing history
 */

import React from 'react';
import { FiDollarSign, FiCheck, FiDownload, FiInbox, FiTrash2 } from 'react-icons/fi';
import SkeletonLoading from '../SkeletonLoading/SkeletonLoading';
import './BillingHistory.css';

const BillingHistory = ({ invoices = [], onClearHistory, loading = false }) => {
  // Filter out $0 invoices
  const filteredInvoices = invoices.filter((invoice) => invoice.amount > 0);

  // Helper function to capitalize status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Add this helper function at the top of the component
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format date like "5 Jan, 2024"
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Format time like "2:30 PM"
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  // Add this helper function to format the amount
  const formatAmount = (amount) => {
    // If amount has no decimal places or only zeros after decimal
    if (amount % 1 === 0) {
      return amount.toFixed(0); // Return without decimal places
    }
    return amount.toFixed(2); // Keep decimals if they exist
  };

  if (loading) {
    return /*#__PURE__*/React.createElement(SkeletonLoading, null);
  }

  if (!Array.isArray(invoices)) {
    console.error('Invalid invoices data:', invoices);
    return (/*#__PURE__*/
      React.createElement("div", { className: "billing-history" }, /*#__PURE__*/
      React.createElement("h3", { className: "subsection-title" }, "Billing History"), /*#__PURE__*/
      React.createElement("div", { className: "empty-history" }, /*#__PURE__*/
      React.createElement(FiInbox, { className: "empty-icon" }), /*#__PURE__*/
      React.createElement("p", { className: "empty-text" }, "Unable to load billing history"), /*#__PURE__*/
      React.createElement("p", { className: "empty-subtext" }, "Please try again later")
      )
      ));

  }

  if (invoices.length === 0) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "billing-history" }, /*#__PURE__*/
      React.createElement("h3", { className: "subsection-title" }, "Billing History"), /*#__PURE__*/
      React.createElement("div", { className: "empty-history" }, /*#__PURE__*/
      React.createElement(FiInbox, { className: "empty-icon" }), /*#__PURE__*/
      React.createElement("p", { className: "empty-text" }, "No billing history available yet"), /*#__PURE__*/
      React.createElement("p", { className: "empty-subtext" }, "Your payment history will appear here once you make a purchase")
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "billing-history" }, /*#__PURE__*/
    React.createElement("div", { className: "history-header" }, /*#__PURE__*/
    React.createElement("h3", { className: "subsection-title" }, "Billing History"),
    filteredInvoices.length > 0 && /*#__PURE__*/
    React.createElement("button", {
      onClick: onClearHistory,
      className: "clear-history-btn" }, /*#__PURE__*/

    React.createElement(FiTrash2, { className: "clear-icon" }), "Clear History"

    )

    ), /*#__PURE__*/
    React.createElement("div", { className: "history-list" },
    filteredInvoices.map((invoice) => /*#__PURE__*/
    React.createElement("div", { key: invoice.id, className: "history-item" }, /*#__PURE__*/
    React.createElement("div", { className: "invoice-details" }, /*#__PURE__*/
    React.createElement("span", { className: "invoice-date" },
    formatDate(invoice.date)
    ), /*#__PURE__*/
    React.createElement("span", { className: "invoice-id" }, "#", invoice.number)
    ), /*#__PURE__*/
    React.createElement("div", { className: "invoice-amount" }, /*#__PURE__*/
    React.createElement(FiDollarSign, { className: "amount-icon" }), /*#__PURE__*/
    React.createElement("span", null, formatAmount(invoice.amount))
    ), /*#__PURE__*/
    React.createElement("div", { className: "invoice-status success" }, /*#__PURE__*/
    React.createElement(FiCheck, { className: "status-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Paid")
    ), /*#__PURE__*/
    React.createElement("a", {
      href: invoice.invoice_pdf,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "download-btn" }, /*#__PURE__*/

    React.createElement(FiDownload, null), "Download"

    )
    )
    )
    )
    ));

};

export default BillingHistory;