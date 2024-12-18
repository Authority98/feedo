/**
 * Dashboard Page Component
 * 
 * Main dashboard interface that combines multiple sections:
 * - DataOverview: Shows key metrics and statistics
 * - RecentActivity: Displays user's recent actions and updates
 * - DataSubmission: Handles user data submission and progress
 * 
 * Features:
 * - Modular section-based layout
 * - Real-time data updates
 * - Interactive components
 * - Responsive design
 */

import React from 'react';

// Section imports
import DataSubmission from './sections/DataSubmission/DataSubmission';
import DataOverview from './sections/DataOverview/DataOverview';
import RecentActivity from './sections/RecentActivity/RecentActivity';

const Dashboard = () => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "dashboard-page" }, /*#__PURE__*/

    React.createElement(DataOverview, null), /*#__PURE__*/


    React.createElement(RecentActivity, null), /*#__PURE__*/


    React.createElement(DataSubmission, null)
    ));

};

export default Dashboard;