/**
 * Account Section Component
 * Features:
 * - Personal information management
 * - Password management (email users only)
 * - Account deletion
 */

import React, { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './Account.css';
import ChangePassword from '../../../../../components/ChangePassword/ChangePassword';
import DeleteAccount from '../../../../../components/DeleteAccount/DeleteAccount';
import PersonalInfoForm from '../../../../../components/PersonalInfoForm/PersonalInfoForm';
import { useAuth } from '../../../../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import { useToast } from '../../../../../components/Toast/ToastContext';

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, deleteAccount, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Check if user is a Google user
  const isGoogleUser = user?.profile?.provider === 'google.com';

  // Handle personal information update
  const handlePersonalInfoUpdate = async (formData) => {
    try {
      const userRef = doc(db, 'users', user.profile.authUid);
      const updateData = {
        'profile.firstName': formData.firstName,
        'profile.lastName': formData.lastName,
        'profile.email': formData.email,
        'metadata.lastUpdated': serverTimestamp()
      };

      await updateDoc(userRef, updateData);
      await refreshUser();
      showSuccess('Personal information updated successfully');
    } catch (error) {
      console.error('Error updating personal information:', error);
      showError('Failed to update personal information');
      throw new Error('Failed to update personal information');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  // Handle successful password change
  const handlePasswordChanged = async () => {
    try {
      const userRef = doc(db, 'users', user.profile.authUid);
      await updateDoc(userRef, {
        'metadata.passwordLastChanged': serverTimestamp()
      });

      await refreshUser();
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error updating password timestamp:', error);
    }
  };

  if (authLoading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "account-section" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-skeleton" }, /*#__PURE__*/
      React.createElement("div", { className: "skeleton skeleton-title" }), /*#__PURE__*/
      React.createElement("div", { className: "skeleton skeleton-form" })
      )
      ));

  }

  // Format the last changed date with time
  const formatLastChanged = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    return date.toLocaleString(undefined, dateOptions).
    replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "account-section" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, "Account Settings"), /*#__PURE__*/

    React.createElement("div", { className: "account-form" }, /*#__PURE__*/

    React.createElement("div", { className: "personal-info-section mb-8" }, /*#__PURE__*/
    React.createElement("h3", { className: "text-lg font-medium text-gray-800 mb-4" }, "Personal Information"), /*#__PURE__*/
    React.createElement(PersonalInfoForm, {
      user: user,
      onSave: handlePersonalInfoUpdate,
      isGoogleUser: isGoogleUser }
    )
    ),


    error && /*#__PURE__*/
    React.createElement("div", { className: "text-red-500 mt-4" },
    error
    ),



    !isGoogleUser && /*#__PURE__*/
    React.createElement("div", { className: "password-section" }, /*#__PURE__*/
    React.createElement("h3", null, "Password"), /*#__PURE__*/
    React.createElement("p", { className: "last-changed" }, "Last changed ",
    formatLastChanged(user?.metadata?.passwordLastChanged)
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "change-password-btn",
      onClick: () => setShowChangePassword(true) },
    "Change Password"

    )
    ), /*#__PURE__*/



    React.createElement("div", { className: "delete-account-section" }, /*#__PURE__*/
    React.createElement("div", { className: "warning-tag" }, /*#__PURE__*/
    React.createElement(FiAlertTriangle, null), /*#__PURE__*/
    React.createElement("span", null, "Caution")
    ), /*#__PURE__*/
    React.createElement("h3", null, "Delete Account"), /*#__PURE__*/
    React.createElement("p", { className: "delete-description" }, "Once you delete your account, there is no going back. Please be certain."

    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "delete-btn",
      onClick: () => setShowDeleteAccount(true) },
    "Delete My Account"

    )
    )
    ),


    showChangePassword && !isGoogleUser && /*#__PURE__*/
    React.createElement(ChangePassword, {
      isOpen: showChangePassword,
      onClose: () => setShowChangePassword(false),
      onPasswordChanged: handlePasswordChanged }
    ), /*#__PURE__*/



    React.createElement(DeleteAccount, {
      isOpen: showDeleteAccount,
      onClose: () => setShowDeleteAccount(false),
      onConfirmDelete: handleDeleteAccount }
    )
    ));

};

export default Account;