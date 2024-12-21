/**
 * DashboardHeader Component with enhanced interactivity
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiMessageSquare, FiFileText, FiHeart, FiTrendingUp, FiSettings, FiLogOut, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiUser, FiBook, FiShield, FiSun, FiBriefcase, FiChevronRight } from 'react-icons/fi';
import { logo } from '../../assets';
import './DashboardHeader.css';
import { FALLBACK_PROFILE_IMAGE, getEmojiAvatar } from '../../auth/profileData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { applicationOperations, opportunityOperations } from '../../applications/applicationManager';
import Button from '../Button/Button';
import { db, auth } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import useProfileProgress from '../../hooks/useProfileProgress';
import NotificationBell from '../NotificationBell/NotificationBell';
import SearchBar from '../SearchBar/SearchBar';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const DashboardHeader = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { sections, getMissingSteps, isLoading: sectionsLoading } = useProfileProgress();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { refreshUser } = useAuth();

  // Add detailed debug logging













  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Suggested searches data
  const suggestedSearches = [
  "Analytics dashboard",
  "Project timeline",
  "Budget overview",
  "Team members"];


  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearch = async (query) => {
    try {
      // Fetch applications and opportunities
      const [applications, opportunities] = await Promise.all([
      applicationOperations.getUserApplications(user.profile.authUid),
      opportunityOperations.getOpportunities({ userId: user.profile.authUid })]
      );

      // Search through applications
      const applicationResults = applications.
      filter((app) =>
      app.name?.toLowerCase().includes(query.toLowerCase()) ||
      app.category?.toLowerCase().includes(query.toLowerCase()) ||
      app.status?.toLowerCase().includes(query.toLowerCase())
      ).
      map((app) => ({
        id: app.id,
        title: app.name,
        type: 'Application',
        status: app.status,
        icon: 'FiFileText',
        link: '/my-applications'
      }));

      // Search through opportunities
      const opportunityResults = opportunities.
      filter((opp) =>
      opp.title?.toLowerCase().includes(query.toLowerCase()) ||
      opp.description?.toLowerCase().includes(query.toLowerCase())
      ).
      map((opp) => ({
        id: opp.id,
        title: opp.title,
        type: 'Opportunity',
        status: opp.status,
        icon: 'FiBriefcase',
        link: '/new-opportunities'
      }));

      // Combine and sort results
      return [...applicationResults, ...opportunityResults].
      sort((a, b) => a.title.localeCompare(b.title)).
      slice(0, 5); // Limit to 5 results
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnread: false
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Calculate unreadCount from notifications
  const unreadCount = notifications.filter((notification) => notification.isUnread).length;

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsProfileDropdownOpen(false);
  };

  // Use AuthContext's user data for profile display
  const getProfileImage = () => {
    if (authLoading) return FALLBACK_PROFILE_IMAGE;









    // For Google users, always use auth.currentUser.photoURL if available
    if (user?.profile?.provider === 'google.com' && auth.currentUser?.photoURL) {

      return auth.currentUser.photoURL;
    }

    // For users with profile photos (including Google users without current auth photo)
    if (user?.profile?.photoURL) {

      return user.profile.photoURL;
    }

    // Try auth user's photo URL as fallback
    if (auth.currentUser?.photoURL) {

      return auth.currentUser.photoURL;
    }

    // Fallback to emoji avatar if we have authUid
    if (user?.profile?.authUid) {
      const emojiAvatar = getEmojiAvatar(user.profile.authUid);

      return emojiAvatar;
    }


    return FALLBACK_PROFILE_IMAGE;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Add checkSectionCompletion function
  const checkSectionCompletion = (sectionId, user, questions) => {
    // If no user data or no profile sections, section is incomplete
    if (!user?.profileSections || !user.profileSections[sectionId]) {

      return false;
    }

    const sectionData = user.profileSections[sectionId];

    // If no questions array in section data, section is incomplete
    if (!sectionData.questions || !Array.isArray(sectionData.questions)) {

      return false;
    }

    // If no questions in config, section is incomplete
    if (!questions || !Array.isArray(questions) || questions.length === 0) {

      return false;
    }

    // Get required questions from config
    const requiredQuestions = questions.filter((q) => q.required);

    // For sections with no required questions, treat all questions as required
    const questionsToCheck = requiredQuestions.length > 0 ? requiredQuestions : questions;

    // Check each question
    for (const question of questionsToCheck) {
      const questionData = sectionData.questions.find((q) => q.id === question.id);

      // If question data doesn't exist or has no answer, section is incomplete
      if (!questionData || !questionData.answer) {

        return false;
      }

      // For repeater type questions
      if (question.type === 'repeater' && question.repeaterFields) {
        // If answer is not an array or is empty, section is incomplete
        if (!Array.isArray(questionData.answer) || questionData.answer.length === 0) {

          return false;
        }

        // Check each repeater entry for fields
        const fieldsToCheck = question.repeaterFields.filter((field) => field.required || requiredQuestions.length === 0);
        for (const entry of questionData.answer) {
          for (const field of fieldsToCheck) {
            if (!entry || !entry[field.id] || entry[field.id] === '') {

              return false;
            }
          }
        }
      }
      // For non-repeater questions
      else {
        // Check for empty string, null, undefined, or empty array
        const isEmpty =
        questionData.answer === '' ||
        questionData.answer === null ||
        questionData.answer === undefined ||
        Array.isArray(questionData.answer) && (
        questionData.answer.length === 0 ||
        questionData.answer.every((a) => a === null || a === undefined || a === ''));


        if (isEmpty) {

          return false;
        }
      }
    }

    // If we get here, all checked questions have valid answers

    return true;
  };

  // Update the useEffect that fetches notifications
  useEffect(() => {
    if (!user?.profile?.authUid || sectionsLoading || authLoading) return;

    const fetchNotifications = async () => {
      try {



        // Get missing steps
        const missingStepsData = getMissingSteps();


        let missingStepNotification = null;

        if (missingStepsData?.sections?.length > 0 && missingStepsData.message) {
          missingStepNotification = {
            id: missingStepsData.sections.length > 1 ? 'missing-multiple' : `missing-${missingStepsData.sections[0].id}`,
            type: missingStepsData.sections.length > 1 ? 'Missing Steps' : 'Missing Step',
            icon: missingStepsData.sections.length > 1 ? FiAlertCircle : getSectionIcon(missingStepsData.sections[0].id),
            content: missingStepsData.message,
            time: 'Now',
            isUnread: true,
            link: `/data-management?tab=${missingStepsData.sections[0].id}`
          };
        }

        // Get saved read states
        const savedNotifications = localStorage.getItem('notifications');
        let readStates = {};
        if (savedNotifications) {
          try {
            const parsed = JSON.parse(savedNotifications);
            readStates = parsed.reduce((acc, n) => ({
              ...acc,
              [n.id]: !n.isUnread
            }), {});
          } catch (error) {
            console.error('Error parsing saved notifications:', error);
          }
        }

        // Fetch other notifications (applications, opportunities, etc.)
        const [applications, opportunities] = await Promise.all([
        applicationOperations.getUserApplications(user.profile.authUid),
        opportunityOperations.getOpportunities({ userId: user.profile.authUid })]
        );

        // Format application notifications
        const applicationNotifications = applications.slice(0, 2).map((app) => ({
          id: `app-${app.id}`,
          type: 'Application',
          icon: getStatusIcon(app.status),
          content: getApplicationStatusMessage(app),
          time: formatTimeAgo(app.createdAt),
          isUnread: !readStates[`app-${app.id}`],
          link: '/my-applications'
        }));

        // Format opportunity notifications
        const opportunityNotifications = opportunities.slice(0, 2).map((opp) => ({
          id: `opp-${opp.id}`,
          type: 'New Opportunity',
          icon: FiSun,
          content: `New opportunity: ${opp.title}`,
          time: formatTimeAgo(opp.createdAt),
          isUnread: !readStates[`opp-${opp.id}`],
          link: '/new-opportunities'
        }));

        // Combine all notifications and preserve read states
        const allNotifications = [
        ...(missingStepNotification ? [{
          ...missingStepNotification,
          isUnread: !readStates[missingStepNotification.id]
        }] : []),
        ...applicationNotifications,
        ...opportunityNotifications].
        sort((a, b) => new Date(b.time) - new Date(a.time));

        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up real-time listeners
    const applicationsRef = collection(db, 'applications');
    const applicationsQuery = query(
      applicationsRef,
      where('userId', '==', user.profile.authUid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const opportunitiesRef = collection(db, 'opportunities');
    const opportunitiesQuery = query(
      opportunitiesRef,
      where('creatorId', '==', user.profile.authUid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    // Subscribe to real-time updates
    const unsubscribeApplications = onSnapshot(applicationsQuery, () => {
      fetchNotifications();
    });

    const unsubscribeOpportunities = onSnapshot(opportunitiesQuery, () => {
      fetchNotifications();
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeApplications();
      unsubscribeOpportunities();
    };
  }, [user?.profile?.authUid, sections, sectionsLoading, authLoading]);

  // Helper function to get application status message
  const getApplicationStatusMessage = (application) => {
    switch (application.status) {
      case 'approved':
        return `Your application for ${application.name} was accepted`;
      case 'rejected':
        return `Your application for ${application.name} was rejected`;
      case 'pending':
        return `Your application for ${application.name} is under review`;
      case 'incomplete':
        return `Complete your application for ${application.name}`;
      case 'follow-up':
        return `Follow-up required for ${application.name}`;
      default:
        return `Applied to ${application.name}`;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return FiCheckCircle;
      case 'rejected':
        return FiAlertTriangle;
      case 'pending':
        return FiFileText;
      case 'incomplete':
        return FiAlertTriangle;
      case 'follow-up':
        return FiAlertCircle;
      default:
        return FiFileText;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-blue-500';
      case 'incomplete':
        return 'text-orange-500';
      case 'follow-up':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      case 'pending':
        return 'bg-blue-50';
      case 'incomplete':
        return 'bg-orange-50';
      case 'follow-up':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  // Helper function to get notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'Missing Steps':
      case 'Missing Step':
        return 'text-orange-500';
      case 'Application':
        return 'text-blue-500';
      case 'New Opportunity':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Helper function to get notification background color
  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'Missing Steps':
      case 'Missing Step':
        return 'bg-orange-50';
      case 'Application':
        return 'bg-blue-50';
      case 'New Opportunity':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  // Add this helper function to get section icon
  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return FiUser;
      case 'education':
        return FiBook;
      case 'workExperience':
        return FiBriefcase;
      case 'verification':
        return FiShield;
      default:
        return FiFileText;
    }
  };

  // Update the getMissingStepNotification function
  const getMissingStepNotification = (user) => {










    // Check if we have sections and user type
    if (!sections.length || !user?.profile?.userType) {

      return null;
    }

    // For new users (no profileData) or empty profileData, show missing steps
    if (!user?.profileData || Object.keys(user?.profileData || {}).length === 0) {

      return {
        id: 'missing-multiple',
        icon: FiAlertCircle,
        content: 'Complete all required sections in your profile',
        time: 'Now',
        isUnread: true,
        type: 'profile',
        targetTab: sections[0].id
      };
    }

    // Get incomplete sections
    const incompleteSections = [];

    sections.forEach((section) => {
      const sectionData = user.profileData?.[section.id];
      const isComplete = sectionData && Object.keys(sectionData).length > 0 &&
      checkSectionCompletion(section.id, sectionData, section);







      if (!isComplete) {
        incompleteSections.push({
          id: section.id,
          label: section.label
        });
      }
    });



    // If multiple sections are incomplete
    if (incompleteSections.length > 1) {
      return {
        id: 'missing-multiple',
        icon: FiAlertCircle,
        content: 'Complete all required sections in your profile',
        time: 'Now',
        isUnread: true,
        type: 'profile',
        targetTab: incompleteSections[0].id
      };
    }

    // If only one section is incomplete
    if (incompleteSections.length === 1) {
      const section = incompleteSections[0];
      return {
        id: `missing-${section.id}`,
        icon: getSectionIcon(section.id),
        content: `Complete your ${section.label.toLowerCase()}`,
        time: 'Now',
        isUnread: true,
        type: 'profile',
        targetTab: section.id
      };
    }

    return null;
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    if (!date) return 'Now';

    // Convert Firestore Timestamp to Date if needed
    const past = date.seconds ? new Date(date.seconds * 1000) : new Date(date);

    if (isNaN(past.getTime())) {
      return 'Now';
    }

    const now = new Date();
    const diffTime = Math.abs(now - past);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    return `${diffDays} days ago`;
  };

  // Handle result click
  const handleResultClick = (result) => {
    navigate(result.link);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Update notification click handler to include tab navigation
  const handleNotificationClick = (notification) => {
    // Mark the clicked notification as read
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isUnread: n.id === notification.id ? false : n.isUnread
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Navigate based on notification type
    switch (notification.type) {
      case 'Missing Steps':
      case 'Missing Step':
        navigate(notification.link);
        break;
      case 'Application':
        navigate('/my-applications');
        break;
      case 'New Opportunity':
        navigate('/new-opportunities');
        break;
      default:
        break;
    }
  };

  // Add handler for upgrade plan button
  const handleUpgradePlan = () => {
    navigate('/subscription');
  };

  return (/*#__PURE__*/
    React.createElement("header", { className: "flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200" }, /*#__PURE__*/

    React.createElement("div", { className: "flex-none transition-transform duration-300 hover:scale-105" }, /*#__PURE__*/
    React.createElement("img", {
      src: logo,
      alt: "Feedo AI Logo",
      className: "h-8 w-auto" }
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "flex items-center gap-6" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "upgrade",
      onClick: handleUpgradePlan,
      className: "w-auto px-10" },
    "Upgrade Plan"

    ), /*#__PURE__*/


    React.createElement(SearchBar, { onSearch: handleSearch }), /*#__PURE__*/


    React.createElement(NotificationBell, {
      notifications: notifications,
      setNotifications: setNotifications }
    ), /*#__PURE__*/


    React.createElement("div", { className: "relative", ref: profileRef }, /*#__PURE__*/
    React.createElement("button", {
      onClick: handleProfileClick,
      className: "flex items-center gap-3 focus:outline-none transition-all duration-300 hover:scale-105 p-1 rounded-lg hover:bg-gray-50" },

    authLoading ? /*#__PURE__*/
    React.createElement("div", { className: "header-profile-loading" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton header-skeleton-avatar" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton header-skeleton-text" })
    ) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "relative" }, /*#__PURE__*/
    React.createElement("div", { className: "relative overflow-hidden rounded-full transition-transform duration-300 hover:scale-110" }, /*#__PURE__*/
    React.createElement("img", {
      src: getProfileImage(),
      alt: `${user?.profile?.firstName || 'User'}'s profile`,
      className: "w-10 h-10 rounded-full object-cover shadow-md",
      onError: async (e) => {
        // For Google users, try to refresh the photo URL
        if (user?.profile?.provider === 'google') {
          try {
            await refreshUser();
            // If refresh successful, retry with the new URL
            e.target.src = getProfileImage();
            return;
          } catch (error) {
            console.error('Error refreshing Google profile photo:', error);
          }
        }

        // Fallback for non-Google users or if refresh fails
        e.target.src = user?.profile?.authUid ?
        getEmojiAvatar(user.profile.authUid) :
        FALLBACK_PROFILE_IMAGE;
      } }
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md" }, /*#__PURE__*/
    React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" })
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: "font-medium text-gray-800 transition-colors duration-300 hover:text-blue-600" },
    user?.profile?.firstName && user?.profile?.lastName ?
    `${user.profile.firstName} ${user.profile.lastName}` :
    user?.metadata?.firstName && user?.metadata?.lastName ?
    `${user.metadata.firstName} ${user.metadata.lastName}` :
    'User'

    )
    )

    ),


    isProfileDropdownOpen && /*#__PURE__*/
    React.createElement("div", { className: "absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg" }, /*#__PURE__*/
    React.createElement("div", { className: "p-4 border-b border-gray-200" }, /*#__PURE__*/
    React.createElement("div", { className: "flex items-center gap-3" }, /*#__PURE__*/
    React.createElement("img", {
      src: getProfileImage(),
      alt: `${user?.profile?.firstName || 'User'}'s profile`,
      className: "w-12 h-12 rounded-full object-cover",
      onError: (e) => {
        if (user?.profile?.provider !== 'google') {
          e.target.src = user?.profile?.authUid ?
          getEmojiAvatar(user.profile.authUid) :
          FALLBACK_PROFILE_IMAGE;
        } else {
          e.target.src = FALLBACK_PROFILE_IMAGE;
        }
      } }
    ), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", { className: "font-semibold text-gray-900" },
    user?.profile?.firstName ?
    `${user.profile.firstName} ${user.profile.lastName || ''}` :
    'User'

    ), /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-gray-500" }, user?.profile?.email)
    )
    )
    ), /*#__PURE__*/
    React.createElement("ul", { className: "py-2" }, /*#__PURE__*/
    React.createElement("li", null, /*#__PURE__*/
    React.createElement("button", {
      onClick: handleSettingsClick,
      className: "w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3" }, /*#__PURE__*/

    React.createElement("div", { className: "p-2 rounded-full bg-gray-100 text-gray-500" }, /*#__PURE__*/
    React.createElement(FiSettings, { className: "w-4 h-4" })
    ), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("p", { className: "text-gray-800" }, "Settings"), /*#__PURE__*/
    React.createElement("span", { className: "text-xs text-gray-500" }, "Manage your preferences")
    )
    )
    ), /*#__PURE__*/
    React.createElement("li", null, /*#__PURE__*/
    React.createElement("button", {
      onClick: handleLogout,
      className: "w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3" }, /*#__PURE__*/

    React.createElement("div", { className: "p-2 rounded-full bg-gray-100 text-red-500" }, /*#__PURE__*/
    React.createElement(FiLogOut, { className: "w-4 h-4" })
    ), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("p", { className: "text-red-600" }, "Log Out"), /*#__PURE__*/
    React.createElement("span", { className: "text-xs text-gray-500" }, "Sign out of your account")
    )
    )
    )
    )
    )

    )
    )
    ));

};

export default DashboardHeader;