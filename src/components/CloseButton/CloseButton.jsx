import React from 'react';
import { FiX } from 'react-icons/fi';
import './CloseButton.css';

const CloseButton = ({ onClick, className = '', position = 'right' }) => {
  return (
    <button 
      className={`panel-close-button ${position} ${className}`}
      onClick={onClick}
      aria-label="Close panel"
    >
      <FiX className="w-5 h-5" />
    </button>
  );
};

export default CloseButton; 