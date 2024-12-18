/**
 * AdminLayout Component
 * 
 * Features:
 * - Consistent layout for admin pages
 * - Includes AdminSidebar
 * - Fixed header
 * - Responsive design
 */

import React from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (/*#__PURE__*/
    React.createElement("div", { className: "admin-layout" }, /*#__PURE__*/
    React.createElement(AdminSidebar, null), /*#__PURE__*/
    React.createElement("div", { className: "admin-content" },
    children
    )
    ));

};

export default AdminLayout;