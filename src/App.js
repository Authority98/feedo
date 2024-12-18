import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
// Import Firebase config
import './firebase/config';
// AuthContext import to handle authentication
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ToastProvider } from './components/Toast/ToastContext';

// Import components after context
import Layout from './components/Layout/Layout';
import Dashboard from './backend/pages/Dashboard/Dashboard';
import MyApplications from './backend/pages/MyApplications/MyApplications';
import NewOpportunities from './backend/pages/NewOpportunities/NewOpportunities';
import DataManagement from './backend/pages/DataManagement/DataManagement';
import Subscription from './backend/pages/Subscription/Subscription';
import LoginSignup from './frontend/pages/LoginSignup/LoginSignup';
import Settings from './backend/pages/Settings/Settings';
import HelpCenter from './backend/pages/HelpCenter/HelpCenter';
import ProfileType from './frontend/pages/ProfileType/ProfileType';

// Import Admin components
import AdminLogin from './admin/AdminLogin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard/AdminDashboard';
import AdminLayout from './admin/AdminLayout/AdminLayout';

// Import AdminAuthProvider
import { AdminAuthProvider, useAdminAuth } from './admin/AdminAuth/AdminAuthContext';

// Import styles last
import './App.css';
import './components/Header/DashboardHeader.css';

// Import ProfileQuestions component
import ProfileQuestions from './admin/Questions/Questions';

// Move ProtectedRoute component definition here
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, /*#__PURE__*/
      React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
      ));

  }

  if (!user) {
    return /*#__PURE__*/React.createElement(Navigate, { to: "/", replace: true });
  }

  return children;
};

// Move ProtectedLayout component definition here
const ProtectedLayout = () => {
  return (/*#__PURE__*/
    React.createElement(ProtectedRoute, null, /*#__PURE__*/
    React.createElement(Layout, null, /*#__PURE__*/
    React.createElement(Outlet, null)
    )
    ));

};

// Update AdminRoute component to use AdminAuthContext
const AdminRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, /*#__PURE__*/
      React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
      ));

  }

  if (!adminUser) {
    return /*#__PURE__*/React.createElement(Navigate, { to: "/admin/login", replace: true });
  }

  return children;
};

// Add AdminLayout component wrapper
const AdminLayoutWrapper = () => {
  return (/*#__PURE__*/
    React.createElement(AdminRoute, null, /*#__PURE__*/
    React.createElement(AdminLayout, null, /*#__PURE__*/
    React.createElement(Outlet, null)
    )
    ));

};

// App component definition last
const App = () => {
  return (/*#__PURE__*/
    React.createElement(Router, null, /*#__PURE__*/
    React.createElement(ToastProvider, null, /*#__PURE__*/
    React.createElement(AuthProvider, null, /*#__PURE__*/
    React.createElement(AdminAuthProvider, null, /*#__PURE__*/
    React.createElement("div", { className: "App" }, /*#__PURE__*/
    React.createElement(Routes, null, /*#__PURE__*/
    React.createElement(Route, { path: "/", element: /*#__PURE__*/React.createElement(LoginSignup, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/admin/login", element: /*#__PURE__*/React.createElement(AdminLogin, null) }), /*#__PURE__*/
    React.createElement(Route, { element: /*#__PURE__*/React.createElement(AdminLayoutWrapper, null) }, /*#__PURE__*/
    React.createElement(Route, { path: "/admin/dashboard", element: /*#__PURE__*/React.createElement(AdminDashboard, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/admin/questions", element: /*#__PURE__*/React.createElement(ProfileQuestions, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/admin/data-management", element: /*#__PURE__*/React.createElement(DataManagement, null) })
    ), /*#__PURE__*/
    React.createElement(Route, { element: /*#__PURE__*/React.createElement(ProtectedLayout, null) }, /*#__PURE__*/
    React.createElement(Route, { path: "/dashboard", element: /*#__PURE__*/React.createElement(Dashboard, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/my-applications", element: /*#__PURE__*/React.createElement(MyApplications, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/new-opportunities", element: /*#__PURE__*/React.createElement(NewOpportunities, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/data-management", element: /*#__PURE__*/React.createElement(DataManagement, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/subscription", element: /*#__PURE__*/React.createElement(Subscription, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/settings", element: /*#__PURE__*/React.createElement(Settings, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/help-center", element: /*#__PURE__*/React.createElement(HelpCenter, null) })
    ), /*#__PURE__*/
    React.createElement(Route, { path: "/profile-type", element: /*#__PURE__*/React.createElement(ProfileType, null) })
    )
    )
    )
    )
    )
    ));

};

export default App;