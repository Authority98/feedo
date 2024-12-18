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
  return (/*#__PURE__*/
    React.createElement("div", { className: "layout-container" }, /*#__PURE__*/

    React.createElement("div", { className: "layout-header" }, /*#__PURE__*/
    React.createElement(DashboardHeader, null)
    ), /*#__PURE__*/


    React.createElement("div", { className: "layout-sidebar" }, /*#__PURE__*/
    React.createElement(Sidebar, null)
    ), /*#__PURE__*/


    React.createElement("div", { className: "layout-main" }, /*#__PURE__*/
    React.createElement("main", { className: "layout-content" }, /*#__PURE__*/
    React.createElement("div", { className: "layout-content-inner" },
    children
    )
    )
    )
    ));

};

export default Layout;