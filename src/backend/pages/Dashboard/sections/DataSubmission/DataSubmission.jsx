/**
 * DataSubmission Component
 * 
 * A comprehensive data submission tracking interface that provides:
 * - Real-time progress tracking for each data section
 * - Dynamic status updates based on form completion
 * - Visual progress indicators
 * - Interactive submission items
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FiAlertCircle, FiCheckCircle, FiChevronRight, FiZap } from 'react-icons/fi';
import './DataSubmission.css';
import { FALLBACK_PROFILE_IMAGE, getEmojiAvatar } from '../../../../../auth/profileData';
import { useAuth } from '../../../../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import useProfileProgress from '../../../../../hooks/useProfileProgress';
import { tokenUsageService } from '../../../../../services/tokenUsage';
import { eventEmitter, EVENTS } from '../../../../../services/eventEmitter';

const TYPE_COLORS = ['type-1', 'type-2', 'type-3', 'type-4', 'type-5',
'type-6', 'type-7', 'type-8', 'type-9', 'type-10'];

const getProfileImage = (user) => {
  // For Google users
  if (user?.profile?.provider === 'google' && user?.profile?.photoURL) {
    return user.profile.photoURL;
  }

  // For users with custom uploaded photos
  if (user?.profile?.photoURL) {
    return user.profile.photoURL;
  }

  // Fallback to emoji avatar if we have authUid
  if (user?.profile?.authUid) {
    return getEmojiAvatar(user.profile.authUid);
  }

  return FALLBACK_PROFILE_IMAGE;
};

// Move ProgressCircle component outside main component
const ProgressCircle = ({ progress }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  return (/*#__PURE__*/
    React.createElement("div", { className: "progress-circle-container" }, /*#__PURE__*/
    React.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 120 120" }, /*#__PURE__*/
    React.createElement("defs", null, /*#__PURE__*/
    React.createElement("linearGradient", { id: "progressGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, /*#__PURE__*/
    React.createElement("stop", { offset: "0%", stopColor: "#0093E9" }), /*#__PURE__*/
    React.createElement("stop", { offset: "100%", stopColor: "#80D0C7" })
    )
    ), /*#__PURE__*/
    React.createElement("circle", {
      className: "progress-circle-bg",
      cx: "60",
      cy: "60",
      r: radius }
    ), /*#__PURE__*/
    React.createElement("circle", {
      className: "progress-circle-path",
      cx: "60",
      cy: "60",
      r: radius,
      strokeDasharray: circumference,
      strokeDashoffset: strokeDashoffset }
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "progress-percentage-pill" },
    progress, "%"
    )
    ));

};

// Create a custom hook for token usage
export const useTokenUsage = (userId, userTier) => {
  const [tokenUsage, setTokenUsage] = useState(null);
  const [loadingTokens, setLoadingTokens] = useState(true);

  const fetchTokenUsage = useCallback(async () => {
    if (userId) {
      try {
        setLoadingTokens(true);
        const usage = await tokenUsageService.checkTokenAvailability(
          userId,
          userTier || 'free'
        );
        setTokenUsage(usage);
      } catch (error) {
        console.error('Error fetching token usage:', error);
      } finally {
        // Add a small delay to make the loading state visible
        setTimeout(() => {
          setLoadingTokens(false);
        }, 500);
      }
    }
  }, [userId, userTier]);

  useEffect(() => {
    fetchTokenUsage();

    // Subscribe to token usage updates
    const unsubscribe = eventEmitter.on(EVENTS.TOKEN_USAGE_UPDATED, () => {

      fetchTokenUsage();
    });

    return () => {
      unsubscribe(); // Cleanup subscription
    };
  }, [fetchTokenUsage]);

  return { tokenUsage, loadingTokens, refreshTokenUsage: fetchTokenUsage };
};

// Export the TokenUsageIndicator as a separate component
export const TokenUsageIndicator = ({ usage }) => {
  const percentage = usage.percentageUsed;
  const getColorClass = () => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "token-usage-section" }, /*#__PURE__*/
    React.createElement("div", { className: "token-usage-header" }, /*#__PURE__*/
    React.createElement(FiZap, { className: "token-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "token-title" }, "AI Credits")
    ), /*#__PURE__*/
    React.createElement("div", { className: "token-usage-bar" }, /*#__PURE__*/
    React.createElement("div", {
      className: "token-usage-progress",
      style: { width: `${percentage}%` } }
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "token-usage-stats" }, /*#__PURE__*/
    React.createElement("span", { className: `token-percentage ${getColorClass()}` },
    percentage, "% used"
    ), /*#__PURE__*/
    React.createElement("span", { className: "token-remaining" },
    usage.remaining.toLocaleString(), " left"
    )
    )
    ));

};

const DataSubmission = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { progress, isLoading, submissionItems } = useProfileProgress();
  const { tokenUsage, loadingTokens } = useTokenUsage(
    user?.profile?.authUid,
    user?.profile?.tier
  );

  // Update the formatProfileType function
  const formatProfileType = (type) => {
    if (!type) return '';

    // First, handle different delimiters (camelCase, snake_case, hyphen-case)
    const words = type.
    split(/(?=[A-Z])|[-_]/) // Split on capital letters, hyphens, or underscores
    .map((word) =>
    word.
    toLowerCase()
    // Capitalize first letter of each word
    .replace(/^./, (str) => str.toUpperCase())
    ).
    join(' ');

    // Get a consistent random color based on the type string
    const colorIndex = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % TYPE_COLORS.length;
    const colorClass = TYPE_COLORS[colorIndex];

    // Use the predefined class if it exists, otherwise use the random color
    const finalColorClass = ['jobseeker', 'entrepreneur', 'student', 'company', 'pending'].
    includes(type.toLowerCase()) ? type.toLowerCase() : colorClass;

    return (/*#__PURE__*/
      React.createElement("span", { className: `profile-status ${finalColorClass}` },
      words
      ));

  };

  // Add handler for section click
  const handleSectionClick = (sectionId) => {
    navigate(`/data-management?tab=${sectionId}`);
  };

  if (authLoading || isLoading || loadingTokens) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "data-submission-container" }, /*#__PURE__*/
      React.createElement("div", { className: "data-submission-header" }, /*#__PURE__*/
      React.createElement("h2", { className: "data-submission-title" }, "Data Submission")
      ), /*#__PURE__*/
      React.createElement("div", { className: "company-progress-section" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-state" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-spinner" })
      )
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "data-submission-container" }, /*#__PURE__*/
    React.createElement("div", { className: "data-submission-header" }, /*#__PURE__*/
    React.createElement("h2", { className: "data-submission-title" }, "Data Submission")
    ), /*#__PURE__*/

    React.createElement("div", { className: "company-progress-section" }, /*#__PURE__*/
    React.createElement("div", { className: "user-profile" }, /*#__PURE__*/
    React.createElement("div", { className: "user-avatar-container" }, /*#__PURE__*/
    React.createElement(ProgressCircle, { progress: progress }), /*#__PURE__*/
    React.createElement("img", {
      src: getProfileImage(user),
      alt: "Profile",
      className: "user-avatar",
      onError: (e) => {
        if (user?.profile?.provider !== 'google') {
          e.target.src = user?.profile?.authUid ?
          getEmojiAvatar(user.profile.authUid) :
          FALLBACK_PROFILE_IMAGE;
        } else {
          e.target.src = FALLBACK_PROFILE_IMAGE;
        }
      } }
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "company-info" }, /*#__PURE__*/
    React.createElement("h3", { className: "company-name" },
    user?.profile?.firstName && user?.profile?.lastName ?
    `${user.profile.firstName} ${user.profile.lastName}` :
    'User'
    ), /*#__PURE__*/
    React.createElement("p", { className: "company-category" },
    formatProfileType(user?.profile?.userType)
    )
    )
    ),

    tokenUsage && /*#__PURE__*/
    React.createElement(TokenUsageIndicator, { usage: tokenUsage }), /*#__PURE__*/


    React.createElement("div", { className: "submission-items-list" },
    [...submissionItems].
    sort((a, b) => {
      if (a.status === 'complete' && b.status !== 'complete') return -1;
      if (a.status !== 'complete' && b.status === 'complete') return 1;
      return 0;
    }).
    map((item) => /*#__PURE__*/
    React.createElement("button", {
      key: item.id,
      className: "submission-item",
      onClick: () => handleSectionClick(item.id),
      "aria-label": `Go to ${item.type} section` }, /*#__PURE__*/

    React.createElement("div", { className: "item-content" },
    item.status === 'complete' ? /*#__PURE__*/
    React.createElement(FiCheckCircle, { className: "status-icon complete" }) : /*#__PURE__*/

    React.createElement(FiAlertCircle, { className: "status-icon incomplete" }), /*#__PURE__*/

    React.createElement("div", { className: "item-text" }, /*#__PURE__*/
    React.createElement("p", { className: "item-type" }, item.type), /*#__PURE__*/
    React.createElement("span", { className: `item-label ${item.status}` },
    item.label
    )
    )
    ), /*#__PURE__*/
    React.createElement(FiChevronRight, { className: "chevron-icon" })
    )
    )
    )
    ));

};

export default DataSubmission;