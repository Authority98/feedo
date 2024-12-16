/**
 * CrispChat Component
 * Handles user data synchronization with Crisp chat
 */

import { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

const CrispChat = () => {
  const { user } = useAuth();

  // Set user information when available
  useEffect(() => {
    if (window.$crisp && user?.profile) {
      // Set user data
      window.$crisp.push([
        "set", 
        "user:email", 
        [user.profile.email]
      ]);
      
      window.$crisp.push([
        "set", 
        "user:nickname", 
        [user.profile.firstName + ' ' + user.profile.lastName]
      ]);

      // Set user's profile photo if available
      if (user.profile.photoURL) {
        window.$crisp.push([
          "set", 
          "user:avatar", 
          [user.profile.photoURL]
        ]);
      }

      // Set custom user data
      window.$crisp.push([
        "set", 
        "session:data", 
        [[
          ["userType", user.profile.userType],
          ["userId", user.profile.authUid]
        ]]
      ]);

      // Set theme color
      window.$crisp.push([
        "set", 
        "session:data", 
        [[
          ["theme", "blue"]
        ]]
      ]);
    }
  }, [user]);

  return null;
};

export default CrispChat; 