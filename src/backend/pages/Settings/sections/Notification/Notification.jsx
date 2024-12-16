/**
 * Notification Settings Section Component
 * Features:
 * - Email notification preferences
 * - Push notification settings
 */

import React, { useState } from 'react';
import { 
  FiBell, 
  FiMail
} from 'react-icons/fi';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true
  });

  const handleToggle = (category) => {
    setNotifications(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const NotificationToggle = ({ enabled, onClick }) => (
    <button 
      onClick={onClick}
      className={`toggle-button ${enabled ? 'active' : ''}`}
      aria-checked={enabled}
      role="switch"
    />
  );

  return (
    <div className="notification-section">
      <h2 className="section-title">
        <FiBell className="section-icon" />
        Notification Settings
      </h2>

      {/* General Notification Settings */}
      <div className="notification-group">
        <h3 className="subsection-title">General Settings</h3>
        
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon">
                <FiMail />
              </div>
              <div className="setting-details">
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
            </div>
            <NotificationToggle 
              enabled={notifications.emailNotifications}
              onClick={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon">
                <FiBell />
              </div>
              <div className="setting-details">
                <h4>Push Notifications</h4>
                <p>Receive notifications in your browser</p>
              </div>
            </div>
            <NotificationToggle 
              enabled={notifications.pushNotifications}
              onClick={() => handleToggle('pushNotifications')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification; 