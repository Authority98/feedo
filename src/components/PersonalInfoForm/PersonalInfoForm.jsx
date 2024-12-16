import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import './PersonalInfoForm.css';

const PersonalInfoForm = ({ user, onSave, isGoogleUser }) => {
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.profile?.email || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
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

  return (
    <form onSubmit={handleSubmit} className="personal-info-settings-form">
      <Box className="personal-info-settings-grid">
        <Box className="personal-info-settings-name-fields">
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            fullWidth
            disabled={loading}
            variant="outlined"
            {...inputProps}
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            fullWidth
            disabled={loading}
            variant="outlined"
            {...inputProps}
          />
        </Box>
        <TextField
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          fullWidth
          disabled={loading || isGoogleUser}
          helperText={isGoogleUser ? 'Email cannot be changed for Google accounts' : ''}
          type="email"
          variant="outlined"
          {...inputProps}
        />
      </Box>

      {error && (
        <Box className="personal-info-settings-error" mt={2}>
          {error}
        </Box>
      )}

      <Box className="personal-info-settings-actions">
        <button
          type="submit"
          className="personal-info-settings-save-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </Box>
    </form>
  );
};

export default PersonalInfoForm; 