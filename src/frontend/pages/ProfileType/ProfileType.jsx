/**
 * Profile Type Selection Page Component
 * Features:
 * - Dynamic profile types loaded from Firestore
 * - Interactive profile cards with hover effects
 * - Smooth animations and transitions
 * - Responsive design
 * - Progress tracking
 */

// React core imports
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

// Firebase imports
import { db, auth } from '../../../firebase/config';
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  setDoc } from
'firebase/firestore';

// Icon imports - now dynamic based on profile type data
import * as ReactIcons from 'react-icons/fi';

// Static assets
import feedoLogo from '../../../assets/images/feedo-logo.png';
import girlImage from '../../../assets/images/girl.png';
import awardBadge from '../../../assets/images/award-badge.png';

// Auth context and user operations
import { useAuth } from '../../../auth/AuthContext';
import { userOperations, createUserDataStructure } from '../../../auth/userManager';

// Components
import AuthButton from '../../../components/AuthButton/AuthButton';

// Styles
import './ProfileType.css';
import '../../../styles/scrollbar.css';

// Add import for PROFILE_ICONS
import { PROFILE_ICONS } from '../../../admin/Icons/profileIcons';

const ProfileType = () => {
  const navigate = useNavigate();
  const { user, updateProfile, refreshUser, updateUserType } = useAuth();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profileTypes, setProfileTypes] = useState([]);
  const [loadingProfileTypes, setLoadingProfileTypes] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile types from Firestore
  useEffect(() => {
    const fetchProfileTypes = async () => {
      try {
        // Debug log

        // Get the admin profiles document
        const profilesDocRef = doc(db, 'admin', 'profiles');
        const profilesDoc = await getDoc(profilesDocRef);

        if (!profilesDoc.exists()) {

          setError('No profile types available. Please contact administrator.');
          return;
        }

        const data = profilesDoc.data();
        const profileTypesData = data.profileTypes || {};

        // Debug log

        if (Object.keys(profileTypesData).length === 0) {

          setError('No profile types available. Please contact administrator.');
          return;
        }

        const types = Object.entries(profileTypesData).map(([id, data]) => {
          // Get the correct icon from PROFILE_ICONS based on the stored icon id
          let IconComponent;
          try {
            // Find the icon in PROFILE_ICONS array using the stored icon id
            const iconData = PROFILE_ICONS.find((icon) => icon.id === data.icon);
            IconComponent = iconData ? iconData.icon : ReactIcons.FiUser;

            if (!IconComponent) {
              console.warn(`Icon ${data.icon} not found in PROFILE_ICONS, using default`);
              IconComponent = ReactIcons.FiUser;
            }
          } catch (error) {
            console.warn(`Error loading icon for ${data.label}, using default:`, error);
            IconComponent = ReactIcons.FiUser;
          }

          return {
            id,
            label: data.label || 'Unnamed Profile Type',
            subtitle: data.subtitle || 'No description available',
            icon: IconComponent,
            sections: data.sections || {}
          };
        });

        // Debug log
        setProfileTypes(types);
      } catch (error) {
        console.error('Error fetching profile types:', error);
        setError('Failed to load profile types. Please try again later.');
      } finally {
        setLoadingProfileTypes(false);
      }
    };

    fetchProfileTypes();
  }, []);

  // Check user state and handle redirects
  useEffect(() => {
    const checkUserState = async () => {


      if (!user && !auth.currentUser && !isLoading) {
        // Only redirect to login if we're sure there's no auth in progress
        const noAuthInProgress = !location.state?.fromSignup && !location.state?.userId;
        if (noAuthInProgress) {

          navigate('/', { replace: true });
          return;
        }
      } else if (user && !user.isPending && !isLoading) {

        navigate('/dashboard', { replace: true });
        return;
      }

      setIsInitializing(false);
    };

    checkUserState();
  }, [user, isLoading, navigate, location.state]);

  // Handle profile type selection
  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  // Handle next button click
  const handleNext = async () => {
    if (selectedType) {
      setIsLoading(true);
      setError(null);
      try {
        // Use the updateUserType function from AuthContext
        await updateUserType(selectedType);

        // Wait for state updates to propagate
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error updating profile type:', error);
        setError('Failed to update profile type. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading state
  if (isInitializing || loadingProfileTypes) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, /*#__PURE__*/
      React.createElement("div", { className: "text-center" }, /*#__PURE__*/
      React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), /*#__PURE__*/
      React.createElement("p", { className: "text-gray-600" }, "Loading...")
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "profile-type-container" }, /*#__PURE__*/

    React.createElement("div", { className: "profile-type-left" }, /*#__PURE__*/
    React.createElement("img", { src: feedoLogo, alt: "Feedo AI Logo", className: "feedo-logo" }), /*#__PURE__*/
    React.createElement("div", { className: "hero-image" }, /*#__PURE__*/
    React.createElement("img", { src: girlImage, alt: "Professional woman with laptop" })
    ), /*#__PURE__*/
    React.createElement("div", { className: "award-badges" }, /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" }), /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" }), /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" })
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "profile-type-right hide-scrollbar-y" }, /*#__PURE__*/
    React.createElement("div", { className: "profile-type-content" }, /*#__PURE__*/
    React.createElement("div", { className: "text-center" }, /*#__PURE__*/
    React.createElement("h1", { className: "welcome-title" }, "Welcome!"), /*#__PURE__*/
    React.createElement("h2", { className: "selection-title" }, "Select Your Profile to Get Started"), /*#__PURE__*/
    React.createElement("p", { className: "selection-description" }, "Choose your profile type to receive personalized opportunities tailored to your needs."

    )
    ),

    error ? /*#__PURE__*/
    React.createElement("div", { className: "error-container" }, /*#__PURE__*/
    React.createElement("div", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, { className: "error-icon" }), /*#__PURE__*/
    React.createElement("p", null, error)
    )
    ) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "profile-type-grid" },
    profileTypes.map((type) => /*#__PURE__*/
    React.createElement("button", {
      key: type.id,
      className: `profile-type-card ${selectedType === type.id ? 'selected' : ''}`,
      onClick: () => handleTypeSelect(type.id) }, /*#__PURE__*/

    React.createElement("div", { className: "card-icon" }, /*#__PURE__*/
    React.createElement(type.icon, { size: 28 })
    ), /*#__PURE__*/
    React.createElement("h3", { className: "card-title" }, type.label), /*#__PURE__*/
    React.createElement("p", { className: "card-description" }, type.subtitle)
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "text-center" }, /*#__PURE__*/
    React.createElement(AuthButton, {
      onClick: handleNext,
      isLoading: isLoading,
      disabled: !selectedType || isLoading,
      className: "auth-button" },

    selectedType ? 'Continue' : 'Select a profile type'
    )
    )
    )

    ), /*#__PURE__*/

    React.createElement("footer", { className: "profile-type-footer" }, /*#__PURE__*/
    React.createElement("div", { className: "copyright" }, "Copyright 2021 - 2022 Feedo Inc. All rights Reserved"

    ), /*#__PURE__*/
    React.createElement("button", { className: "help-btn" }, "Need help?"

    )
    )
    )
    ));

};

export default ProfileType;