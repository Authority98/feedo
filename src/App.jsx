import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastContext';
import { AuthProvider } from './auth/AuthContext';
import CrispChat from './components/CrispChat/CrispChat';

function App() {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* ... existing routes ... */}
              </Routes>
            </div>
          </Router>
          <CrispChat />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App; 