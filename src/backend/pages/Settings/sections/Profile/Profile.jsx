/**
 * Profile Section Component
 * Features:
 * - Animated profile photo with hover effects
 * - Interactive upload button
 * - Smooth transitions and shadows
 * - AuthContext integration
 */

import React, { useState, useEffect } from 'react';
import { FiUser, FiCreditCard, FiBell, FiCamera, FiShield, FiZap } from 'react-icons/fi';
import AnimatedNumber from '../../../../../components/Animated/AnimatedNumber';
import './Profile.css';
import { FALLBACK_PROFILE_IMAGE, getEmojiAvatar } from '../../../../../auth/profileData';
import { storage, auth } from '../../../../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../../../../auth/AuthContext'; // Import useAuth
import { applicationOperations } from '../../../../../applications/applicationManager';
import { useToast } from '../../../../../components/Toast/ToastContext';
import Button from '../../../../../components/Button/Button';
import EnhanceWithAI from '../../../../../components/EnhanceWithAI/EnhanceWithAI';
import { useProfileProgress } from '../../../../../hooks/useProfileProgress';

const TYPE_COLORS = ['type-1', 'type-2', 'type-3', 'type-4', 'type-5',
'type-6', 'type-7', 'type-8', 'type-9', 'type-10'];

const uploadSpinnerStyles = {
  width: '24px',
  height: '24px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid white',
  borderRadius: '50%',
  animation: 'uploadSpin 1s linear infinite',
  marginBottom: '8px'
};

// Add keyframes style
const keyframesStyle = document.createElement('style');
keyframesStyle.innerHTML = `
  @keyframes uploadSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(keyframesStyle);

const uploadProgressStyles = `
  .profile-photo-container {
    position: relative;
    margin-bottom: 24px;
  }

  .profile-photo {
    position: relative;
    width: 96px;
    height: 96px;
  }

  .photo-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .photo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    z-index: 15;
    border-radius: 50%;
  }

  .profile-photo.hovered .photo-overlay {
    opacity: 1;
  }

  .profile-photo.hovered .photo {
    transform: scale(1.1);
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 16;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  .overlay-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .overlay-text {
    font-size: 12px;
    font-weight: 500;
  }

  .upload-progress-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    z-index: 20;
  }

  .upload-progress-circle {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-ring {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .progress-ring-circle-bg {
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    stroke-dasharray: 276.46;
    stroke-dashoffset: 0;
  }

  .progress-ring-circle {
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    stroke-dasharray: 276.46;
    stroke-dashoffset: 69.115;
    animation: progress-spin 2s linear infinite;
  }

  .upload-progress-content {
    position: relative;
    z-index: 21;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #246BFD;
  }

  .upload-icon {
    font-size: 24px;
    margin-bottom: 4px;
    animation: upload-bounce 1s ease infinite;
  }

  .upload-text {
    font-size: 12px;
    font-weight: 500;
  }

  @keyframes progress-spin {
    0% {
      stroke-dashoffset: 276.46;
    }
    50% {
      stroke-dashoffset: 69.115;
    }
    100% {
      stroke-dashoffset: 276.46;
    }
  }

  @keyframes upload-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = uploadProgressStyles;
document.head.appendChild(styleSheet);

const Profile = ({ activeSection, onSectionChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSelectingFile, setIsSelectingFile] = useState(false);
  const [stats, setStats] = useState({
    applications: 0,
    profileCompletion: 0
  });

  // Use AuthContext and ProfileProgress hook
  const { user, loading: authLoading, updateProfile, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { progress, isLoading: progressLoading } = useProfileProgress();

  const menuItems = [
  { id: 'account', icon: FiUser, label: 'Account' },
  { id: 'payment', icon: FiCreditCard, label: 'Payment' },
  { id: 'notification', icon: FiBell, label: 'Notification' },
  { id: 'two-step', icon: FiShield, label: 'Two-Step Authentication' }];


  const getProfileImage = () => {
    if (authLoading) return FALLBACK_PROFILE_IMAGE;









    // For Google users, try profile photoURL first, then auth photoURL
    if (user?.profile?.provider === 'google.com') {
      if (user.profile?.photoURL) {

        return user.profile.photoURL;
      }
      if (auth.currentUser?.photoURL) {

        return auth.currentUser.photoURL;
      }
    }

    // For users with custom uploaded photos
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

  const handlePhotoUpload = async (event) => {
    setIsSelectingFile(false);
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Invalid file type. Please upload an image.', 'error');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showToast('File is too large. Maximum size is 5MB.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      setImageLoaded(false);

      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Create storage reference with unique filename
      const storageRef = ref(storage, `profile-photos/${user.profile.authUid}/${uniqueFileName}`);

      // Upload with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: user.profile.authUid,
          originalName: file.name
        }
      };

      // Upload the file
      await uploadBytes(storageRef, file, metadata);
      const photoURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile({
        profile: {
          ...user.profile,
          photoURL
        }
      });

      // Force a refresh of the user data to get the new photo URL
      await refreshUser();

      // Create a promise that resolves when the new image loads
      const imageLoadPromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = photoURL;
      });

      // Wait for the image to load before showing success message
      await imageLoadPromise;

      // Reset states and show success message
      setImageLoaded(true);
      showToast('Profile photo updated successfully!', 'success');

    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('Failed to update profile photo. Please try again.', 'error');
      // Reset the file input
      event.target.value = '';
      setImageLoaded(true);
    } finally {
      setIsUploading(false);
      setIsSelectingFile(false);
      setIsHovered(false);
    }
  };

  // Helper function to format profile type
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

  // Add this console.log to debug


  // Add useEffect to fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.profile?.authUid) return;

      try {
        // Fetch application stats
        const applicationStats = await applicationOperations.getApplicationStats(user.profile.authUid);

        setStats({
          applications: applicationStats.total || 0,
          profileCompletion: progress // Use progress from useProfileProgress hook
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (!progressLoading) {
      fetchStats();
    }
  }, [user, progress, progressLoading]);

  return (/*#__PURE__*/
    React.createElement("div", { className: "profile-section" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, "Profile"), /*#__PURE__*/

    React.createElement("div", { className: "profile-content" },
    authLoading ? /*#__PURE__*/
    React.createElement("div", { className: "profile-loading" }, /*#__PURE__*/
    React.createElement("div", { className: "skeleton skeleton-photo" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton skeleton-text name" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton skeleton-text email" }), /*#__PURE__*/
    React.createElement("div", { className: "skeleton skeleton-text type" })
    ) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", {
      className: "profile-photo-container",
      onMouseEnter: () => !isSelectingFile && setIsHovered(true),
      onMouseLeave: () => !isSelectingFile && setIsHovered(false),
      title: user?.profile?.provider === 'google.com' ? "Profile photo cannot be changed for Google users" : "" }, /*#__PURE__*/

    React.createElement("div", { className: `profile-photo ${isHovered || isSelectingFile ? 'hovered' : ''}` }, /*#__PURE__*/
    React.createElement("div", { className: "photo-wrapper" }, /*#__PURE__*/
    React.createElement("img", {
      src: getProfileImage(),
      alt: "Profile",
      className: `photo ${isUploading ? 'uploading' : ''} ${imageLoaded ? 'loaded' : ''}`,
      onLoad: () => setImageLoaded(true),
      onError: (e) => {






        // Try auth user's photo URL first
        if (auth.currentUser?.photoURL) {
          e.target.src = auth.currentUser.photoURL;
          return;
        }

        // Then try emoji avatar
        if (user?.profile?.authUid) {
          e.target.src = getEmojiAvatar(user.profile.authUid);
          return;
        }

        // Finally fallback to default image
        e.target.src = FALLBACK_PROFILE_IMAGE;
        setImageLoaded(true);
      } }
    ),
    !imageLoaded && /*#__PURE__*/
    React.createElement("div", { className: "photo-placeholder" }, /*#__PURE__*/
    React.createElement(FiUser, { className: "placeholder-icon" })
    ),

    isUploading && /*#__PURE__*/
    React.createElement("div", { className: "photo-overlay", style: { opacity: 1 } }, /*#__PURE__*/
    React.createElement("div", { className: "upload-spinner", style: uploadSpinnerStyles }), /*#__PURE__*/
    React.createElement("span", { className: "overlay-text" }, "Uploading...")
    ),

    (isHovered || isSelectingFile) && !isUploading && user?.profile?.provider !== 'google.com' && /*#__PURE__*/
    React.createElement("label", {
      className: "photo-overlay",
      htmlFor: "photo-upload",
      onClick: () => setIsSelectingFile(true) }, /*#__PURE__*/

    React.createElement("input", {
      type: "file",
      id: "photo-upload",
      accept: "image/*",
      onChange: handlePhotoUpload,
      className: "hidden" }
    ), /*#__PURE__*/
    React.createElement(FiCamera, { className: "overlay-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "overlay-text" }, "Change Photo")
    ),

    (isHovered || isSelectingFile) && user?.profile?.provider === 'google.com' && /*#__PURE__*/
    React.createElement("div", { className: "photo-overlay google-user" }, /*#__PURE__*/
    React.createElement("span", { className: "overlay-text" }, "Cannot change Google profile photo"

    )
    )

    ), /*#__PURE__*/
    React.createElement("div", { className: "status-indicator" }, /*#__PURE__*/
    React.createElement("span", { className: "status-dot" })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "profile-info" }, /*#__PURE__*/
    React.createElement("h3", { className: "profile-name" },
    user?.profile?.firstName && user?.profile?.lastName ?
    `${user.profile.firstName} ${user.profile.lastName}` :
    user?.metadata?.firstName && user?.metadata?.lastName ?
    `${user.metadata.firstName} ${user.metadata.lastName}` :
    'User',

    user?.profile?.userType &&
    formatProfileType(user.profile.userType)

    ), /*#__PURE__*/
    React.createElement("p", { className: "profile-email" }, user?.profile?.email), /*#__PURE__*/

    React.createElement("div", { className: "profile-stats" }, /*#__PURE__*/
    React.createElement("div", { className: "stat-item" }, /*#__PURE__*/
    React.createElement("span", { className: "stat-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: stats.applications })
    ), /*#__PURE__*/
    React.createElement("span", { className: "stat-label" }, "Applications")
    ), /*#__PURE__*/
    React.createElement("div", { className: "stat-divider" }), /*#__PURE__*/
    React.createElement("div", { className: "stat-item" }, /*#__PURE__*/
    React.createElement("span", { className: "stat-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: stats.profileCompletion }), "%"
    ), /*#__PURE__*/
    React.createElement("span", { className: "stat-label" }, "Profile")
    )
    )
    ), /*#__PURE__*/

    React.createElement("nav", { className: "profile-nav" },
    menuItems.map((item) => /*#__PURE__*/
    React.createElement("button", {
      key: item.id,
      className: `nav-item ${activeSection === item.id ? 'active' : ''}`,
      onClick: () => onSectionChange(item.id) }, /*#__PURE__*/

    React.createElement(item.icon, { className: "nav-icon" }), /*#__PURE__*/
    React.createElement("span", null, item.label)
    )
    )
    )
    )

    )
    ));

};

export default Profile;