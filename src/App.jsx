import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastContext';
import { AuthProvider } from './auth/AuthContext';
import CrispChat from './components/CrispChat/CrispChat';

function App() {
  return (/*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(ToastProvider, null, /*#__PURE__*/
    React.createElement(AuthProvider, null, /*#__PURE__*/
    React.createElement(Router, null, /*#__PURE__*/
    React.createElement("div", { className: "app" }, /*#__PURE__*/
    React.createElement(Routes, null

    )
    )
    ), /*#__PURE__*/
    React.createElement(CrispChat, null)
    )
    )
    ));

}

export default App;