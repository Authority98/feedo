/**
 * AdminSidebar Component
 * 
 * Features:
 * - Navigation links
 * - Active link highlighting
 * - Logout functionality
 * - Responsive design
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiDatabase } from 'react-icons/fi';
import { useAdminAuth } from '../AdminAuth/AdminAuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "admin-sidebar" }, /*#__PURE__*/
    React.createElement("div", { className: "sidebar-header" }, /*#__PURE__*/
    React.createElement("h2", null, "Admin Portal")
    ), /*#__PURE__*/

    React.createElement("nav", { className: "sidebar-nav" }, /*#__PURE__*/
    React.createElement(NavLink, {
      to: "/admin/questions",
      className: ({ isActive }) =>
      `nav-item ${isActive ? 'active' : ''}` }, /*#__PURE__*/


    React.createElement(FiDatabase, { className: "nav-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Questions")
    )
    ), /*#__PURE__*/

    React.createElement("button", {
      onClick: handleLogout,
      className: "sidebar-logout-button" }, /*#__PURE__*/

    React.createElement(FiLogOut, { className: "logout-icon" }), /*#__PURE__*/
    React.createElement("span", null, "Logout")
    )
    ));

};

export default AdminSidebar;