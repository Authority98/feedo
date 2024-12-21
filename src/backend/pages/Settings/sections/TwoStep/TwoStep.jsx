/**
 * Two-Step Authentication Section Component
 * Features:
 * - Enable/disable two-step authentication
 * - QR code generation for authenticator apps
 * - Security settings configuration
 * - Firebase integration
 */

import React, { useState, useEffect } from 'react';
import { FiShield, FiSmartphone, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../../../../auth/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import { authenticator } from 'otplib';
import { useToast } from '../../../../../components/Toast/ToastContext';
import './TwoStep.css';
import LoadingSpinner from '../../../../../components/LoadingSpinner/LoadingSpinner';
import SkeletonLoading from '../../../../../components/SkeletonLoading/SkeletonLoading';

const TwoStep = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Check if user signed up with Google
  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com' || user?.profile?.provider === 'google.com';

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        setIsLoading(true);
        if (user?.profile?.authUid) {
          const userDoc = await getDoc(doc(db, 'users', user.profile.authUid));
          const userData = userDoc.data();
          setIsEnabled(userData?.twoFactorAuth?.enabled || false);
          setSecretKey(userData?.twoFactorAuth?.secret || '');
        }
      } catch (error) {
        console.error('Error fetching 2FA status:', error);
        showToast('Failed to fetch 2FA status', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetch2FAStatus();
  }, [user?.profile?.authUid, showToast]);

  // If Google user, show message instead of 2FA options
  if (isGoogleUser) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "two-step-section" }, /*#__PURE__*/
      React.createElement("h2", { className: "section-title" }, "Two-Step Authentication"), /*#__PURE__*/
      React.createElement("div", { className: "two-step-content" }, /*#__PURE__*/
      React.createElement("div", { className: "security-status" }, /*#__PURE__*/
      React.createElement(FiShield, { className: "status-icon disabled" }), /*#__PURE__*/
      React.createElement("div", { className: "status-info" }, /*#__PURE__*/
      React.createElement("h3", { className: "status-title" }, "Not Available for Google Sign-In"), /*#__PURE__*/
      React.createElement("p", { className: "status-description" }, "Two-step authentication is not available for accounts using Google Sign-In as Google already provides its own security features."

      )
      )
      )
      )
      ));

  }

  const generateSecretKey = () => {
    return authenticator.generateSecret();
  };

  const handleSetupAuthenticator = () => {
    const newSecretKey = generateSecretKey();
    setSecretKey(newSecretKey);
    setShowQRCode(true);
    setError('');
  };

  const handleVerifyCode = async () => {
    try {
      setIsVerifying(true);
      setError('');

      if (!user?.profile?.authUid) {
        throw new Error('User not found');
      }

      // Verify the code using otplib
      const isValid = authenticator.verify({
        token: verificationCode,
        secret: secretKey
      });

      if (isValid) {
        // Update user's 2FA status in Firebase
        await updateDoc(doc(db, 'users', user.profile.authUid), {
          twoFactorAuth: {
            enabled: true,
            secret: secretKey,
            enabledAt: new Date()
          }
        });

        setIsEnabled(true);
        setShowQRCode(false);
        setVerificationCode('');
        showToast('Two-step authentication has been enabled successfully', 'success');
      } else {
        setError('Invalid verification code. Please try again.');
        showToast('Invalid verification code', 'error');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Failed to verify code. Please try again.');
      showToast('Failed to enable two-step authentication', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      if (!user?.profile?.authUid) {
        throw new Error('User not found');
      }

      await updateDoc(doc(db, 'users', user.profile.authUid), {
        twoFactorAuth: {
          enabled: false,
          secret: null,
          enabledAt: null
        }
      });

      setIsEnabled(false);
      setSecretKey('');
      showToast('Two-step authentication has been disabled', 'success');
    } catch (err) {
      console.error('Error disabling 2FA:', err);
      setError('Failed to disable 2FA. Please try again.');
      showToast('Failed to disable two-step authentication', 'error');
    }
  };

  const qrCodeUrl = `otpauth://totp/Feedo:${user?.profile?.email}?secret=${secretKey}&issuer=Feedo`;

  const NotificationToggle = ({ enabled, onClick }) => /*#__PURE__*/
  React.createElement("button", {
    onClick: onClick,
    className: `toggle-button ${enabled ? 'active' : ''}`,
    "aria-checked": enabled,
    role: "switch" }
  );


  return (/*#__PURE__*/
    React.createElement("div", { className: "two-step-section" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, "Two-Step Authentication"), /*#__PURE__*/

    React.createElement("div", { className: "two-step-content" }, /*#__PURE__*/
    React.createElement("div", { className: "security-status" }, /*#__PURE__*/
    React.createElement(FiShield, { className: `status-icon ${isEnabled ? 'enabled' : 'disabled'}` }), /*#__PURE__*/
    React.createElement("div", { className: "status-info" }, /*#__PURE__*/
    React.createElement("h3", { className: "status-title" }, "Two-Step Authentication is ", isEnabled ? 'Enabled' : 'Disabled'), /*#__PURE__*/
    React.createElement("p", { className: "status-description" }, "Add an extra layer of security to your account by requiring a verification code in addition to your password."

    )
    ), /*#__PURE__*/
    React.createElement(NotificationToggle, {
      enabled: isEnabled,
      onClick: () => isEnabled ? handleDisable2FA() : handleSetupAuthenticator() }
    )
    ),

    !isEnabled && /*#__PURE__*/
    React.createElement("div", { className: "authentication-options" }, /*#__PURE__*/
    React.createElement("div", { className: "auth-option" }, /*#__PURE__*/
    React.createElement(FiSmartphone, { className: "option-icon" }), /*#__PURE__*/
    React.createElement("div", { className: "option-info" }, /*#__PURE__*/
    React.createElement("h4", null, "Authenticator App"), /*#__PURE__*/
    React.createElement("p", null, "Use an authenticator app to generate verification codes"), /*#__PURE__*/
    React.createElement("button", {
      className: "setup-button",
      onClick: handleSetupAuthenticator },
    "Set up authenticator"

    )
    )
    )
    )
    ), /*#__PURE__*/



    React.createElement(AnimatePresence, null,
    showQRCode && /*#__PURE__*/
    React.createElement(motion.div, {
      className: "qr-code-modal",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 } }, /*#__PURE__*/

    React.createElement(motion.div, {
      className: "qr-code-content",
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 } }, /*#__PURE__*/

    React.createElement("button", {
      className: "close-modal-btn",
      onClick: () => setShowQRCode(false) }, /*#__PURE__*/

    React.createElement(FiX, null)
    ), /*#__PURE__*/

    React.createElement("h3", null, "Set Up Authenticator"), /*#__PURE__*/
    React.createElement("div", { className: "qr-code-steps" }, /*#__PURE__*/
    React.createElement("p", null, "1. Install an authenticator app like Google Authenticator or Authy"), /*#__PURE__*/
    React.createElement("p", null, "2. Scan this QR code with your authenticator app"), /*#__PURE__*/
    React.createElement("div", { className: "qr-code-container" }, /*#__PURE__*/
    React.createElement(QRCodeSVG, { value: qrCodeUrl, size: 200, level: "H" })
    ), /*#__PURE__*/
    React.createElement("p", null, "3. Enter the 6-digit code from your authenticator app"), /*#__PURE__*/
    React.createElement("div", { className: "verification-input" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      maxLength: "6",
      placeholder: "Enter 6-digit code",
      value: verificationCode,
      onChange: (e) => setVerificationCode(e.target.value.replace(/\D/g, '')) }
    ),
    error && /*#__PURE__*/React.createElement("span", { className: "error-message" }, error)
    ), /*#__PURE__*/
    React.createElement("button", {
      className: "verify-btn",
      onClick: handleVerifyCode,
      disabled: verificationCode.length !== 6 || isVerifying },

    isVerifying ? /*#__PURE__*/
    React.createElement("span", { className: "flex items-center justify-center gap-2" }, /*#__PURE__*/
    React.createElement(LoadingSpinner, { size: "xs", color: "text-white", isBackend: true }), /*#__PURE__*/
    React.createElement("span", null, "Verifying...")
    ) :

    'Verify and Enable'

    )
    )
    )
    )

    )
    )
    ));

};

export default TwoStep;