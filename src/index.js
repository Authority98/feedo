import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/
  React.createElement(React.StrictMode, null, /*#__PURE__*/
  React.createElement(App, null)
  )
);