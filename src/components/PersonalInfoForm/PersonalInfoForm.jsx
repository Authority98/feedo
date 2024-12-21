import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../Toast/ToastContext';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './PersonalInfoForm.css';

// Helper function for spreading props
const _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

const PersonalInfoForm = ({ user, onSave, isGoogleUser }) => {
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.profile?.email || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const inputProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        height: '56px',
        backgroundColor: 'background.paper'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.12)'
      },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.24)'
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#246BFD'
      }
    }
  };

  return (/*#__PURE__*/
    React.createElement("form", { onSubmit: handleSubmit, className: "personal-info-settings-form" }, /*#__PURE__*/
    React.createElement(Box, { className: "personal-info-settings-grid" }, /*#__PURE__*/
    React.createElement(Box, { className: "personal-info-settings-name-fields" }, /*#__PURE__*/
    React.createElement(TextField, _extends({
      label: "First Name",
      value: formData.firstName,
      onChange: (e) => handleChange('firstName', e.target.value),
      required: true,
      fullWidth: true,
      disabled: loading,
      variant: "outlined" },
    inputProps)
    ), /*#__PURE__*/
    React.createElement(TextField, _extends({
      label: "Last Name",
      value: formData.lastName,
      onChange: (e) => handleChange('lastName', e.target.value),
      required: true,
      fullWidth: true,
      disabled: loading,
      variant: "outlined" },
    inputProps)
    )
    ), /*#__PURE__*/
    React.createElement(TextField, _extends({
      label: "Email",
      value: formData.email,
      onChange: (e) => handleChange('email', e.target.value),
      required: true,
      fullWidth: true,
      disabled: loading || isGoogleUser,
      helperText: isGoogleUser ? 'Email cannot be changed for Google accounts' : '',
      type: "email",
      variant: "outlined" },
    inputProps)
    )
    ),

    error && /*#__PURE__*/
    React.createElement(Box, { className: "personal-info-settings-error", mt: 2 },
    error
    ), /*#__PURE__*/


    React.createElement(Box, { className: "personal-info-settings-actions" }, /*#__PURE__*/
    React.createElement("button", {
      type: "submit",
      className: "personal-info-settings-save-btn",
      disabled: loading },

    loading ? 'Saving...' : 'Save Changes'
    )
    )
    ));

};

export default PersonalInfoForm;