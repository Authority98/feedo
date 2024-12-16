/**
 * Layout Component
 * 
 * Features:
 * - Consistent layout wrapper for all backend pages
 * - Includes DashboardHeader and Sidebar
 * - Handles proper content positioning
 */

import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import DashboardHeader from '../Header/DashboardHeader';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* Fixed Header */}
      <div className="layout-header">
        <DashboardHeader />
      </div>
      
      {/* Sidebar - Fixed width and position */}
      <div className="layout-sidebar">
        <Sidebar />
      </div>
      
      {/* Main Content - Adjusted margin to account for fixed sidebar */}
      <div className="layout-main">
        <main className="layout-content">
          <div className="layout-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 