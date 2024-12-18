/**
 * ProfilePhoto Component
 * A unified component for displaying user profile photos across the application
 * Features:
 * - Enhanced Google photo handling with token refresh
 * - Photo URL caching
 * - Custom uploaded photos
 * - Loading states
 * - Error fallbacks
 * - Configurable size and hover effects
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiCamera } from 'react-icons/fi';
import { FALLBACK_PROFILE_IMAGE, getEmojiAvatar } from '../../auth/profileData';
import { useAuth } from '../../auth/AuthContext';
import { auth } from '../../firebase/config';
import './ProfilePhoto.css';

const ProfilePhoto = ({
  size = 'medium', // 'small', 'medium', 'large'
  editable = false,
  onUpload = null,
  showStatus = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cachedPhotoURL, setCachedPhotoURL] = useState('');
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Function to check if a URL is accessible
  const isUrlAccessible = useCallback(async (url) => {
    if (!url) return false;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);

  // Function to get the most up-to-date photo URL for Google users
  const getGooglePhotoURL = useCallback(async () => {








    // Try Firebase auth user's photo URL first (most up-to-date)
    if (auth.currentUser?.photoURL) {
      const isAccessible = await isUrlAccessible(auth.currentUser.photoURL);
      if (isAccessible) {

        return auth.currentUser.photoURL;
      }
    }

    // Then try profile photoURL
    if (user?.profile?.photoURL) {
      const isAccessible = await isUrlAccessible(user.profile.photoURL);
      if (isAccessible) {

        return user.profile.photoURL;
      }
    }

    // If neither works, try to refresh the token
    try {

      await refreshUser();
      if (auth.currentUser?.photoURL) {
        const isAccessible = await isUrlAccessible(auth.currentUser.photoURL);
        if (isAccessible) {

          return auth.currentUser.photoURL;
        }
      }
    } catch (error) {
      console.error('Error refreshing Google photo:', error);
    }

    return null;
  }, [user?.profile?.photoURL, refreshUser, isUrlAccessible]);

  const getProfileImage = useCallback(async () => {
    if (authLoading) return FALLBACK_PROFILE_IMAGE;

    // If we have a cached URL and it's still accessible, use it
    if (cachedPhotoURL) {
      const isAccessible = await isUrlAccessible(cachedPhotoURL);
      if (isAccessible) return cachedPhotoURL;
    }

    // For Google users
    if (user?.profile?.provider === 'google.com') {
      const googlePhotoURL = await getGooglePhotoURL();
      if (googlePhotoURL) {
        setCachedPhotoURL(googlePhotoURL);
        return googlePhotoURL;
      }
    }

    // For users with custom uploaded photos
    if (user?.profile?.photoURL) {
      const isAccessible = await isUrlAccessible(user.profile.photoURL);
      if (isAccessible) {
        setCachedPhotoURL(user.profile.photoURL);
        return user.profile.photoURL;
      }
    }

    // Fallback to emoji avatar if we have authUid
    if (user?.profile?.authUid) {
      const emojiAvatar = getEmojiAvatar(user.profile.authUid);
      setCachedPhotoURL(emojiAvatar);
      return emojiAvatar;
    }

    return FALLBACK_PROFILE_IMAGE;
  }, [user, authLoading, cachedPhotoURL, getGooglePhotoURL]);

  // Effect to update photo URL when user changes
  useEffect(() => {
    let mounted = true;

    const updatePhotoURL = async () => {
      if (!authLoading && mounted) {
        const newPhotoURL = await getProfileImage();
        if (mounted && newPhotoURL !== cachedPhotoURL) {
          setCachedPhotoURL(newPhotoURL);
        }
      }
    };

    updatePhotoURL();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, getProfileImage, cachedPhotoURL]);

  const handlePhotoError = async (e) => {









    // Clear cached URL on error
    setCachedPhotoURL('');

    // For Google users, try to refresh the token and get new URL
    if (user?.profile?.provider === 'google.com') {
      try {

        const newPhotoURL = await getGooglePhotoURL();
        if (newPhotoURL) {

          e.target.src = newPhotoURL;
          setCachedPhotoURL(newPhotoURL);
          return;
        }
      } catch (error) {
        console.error('Error refreshing Google profile photo:', error);
      }
    }

    // Fallback for non-Google users or if refresh fails
    const fallbackURL = user?.profile?.authUid ?
    getEmojiAvatar(user.profile.authUid) :
    FALLBACK_PROFILE_IMAGE;


    e.target.src = fallbackURL;
    setCachedPhotoURL(fallbackURL);
  };

  const handleUploadClick = () => {
    if (onUpload && !isLoading) {
      onUpload();
    }
  };

  const containerClasses = `
    profile-photo-container
    profile-photo-${size}
    ${className}
    ${isLoading ? 'loading' : ''}
  `.trim();

  return (/*#__PURE__*/
    React.createElement("div", {
      className: containerClasses,
      onMouseEnter: () => editable && setIsHovered(true),
      onMouseLeave: () => editable && setIsHovered(false) }, /*#__PURE__*/

    React.createElement("div", { className: `profile-photo ${isHovered ? 'hovered' : ''}` }, /*#__PURE__*/
    React.createElement("div", { className: "photo-wrapper" }, /*#__PURE__*/
    React.createElement("img", {
      src: cachedPhotoURL || FALLBACK_PROFILE_IMAGE,
      alt: `${user?.profile?.firstName || 'User'}'s profile`,
      className: `photo ${imageLoaded ? 'loaded' : ''}`,
      onLoad: () => setImageLoaded(true),
      onError: handlePhotoError }
    ),
    !imageLoaded && /*#__PURE__*/
    React.createElement("div", { className: "photo-placeholder" }, /*#__PURE__*/
    React.createElement(FiUser, { className: "placeholder-icon" })
    ),

    editable && (isHovered || isLoading) && /*#__PURE__*/
    React.createElement("div", {
      className: "photo-overlay",
      onClick: handleUploadClick }, /*#__PURE__*/

    React.createElement(FiCamera, { className: "overlay-icon" }), /*#__PURE__*/
    React.createElement("span", { className: "overlay-text" },
    isLoading ? 'Uploading...' : 'Change Photo'
    )
    )

    ),
    showStatus && /*#__PURE__*/
    React.createElement("div", { className: "status-indicator" }, /*#__PURE__*/
    React.createElement("span", { className: "status-dot" })
    )

    )
    ));

};

export default ProfilePhoto;