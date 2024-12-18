import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiX, FiMail } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../Toast/ToastContext';

// Create a styled version of TextField that overrides global styles
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    '& > input, & > textarea': {
      border: 'none !important',
      outline: 'none !important',
      boxShadow: 'none !important',
      background: 'none !important'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(0, 0, 0, 0.23) !important'
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.palette.primary.main} !important`
  },
  '& .MuiFormLabel-asterisk': {
    display: 'none'
  }
}));

const EmailDialog = ({ open, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create email content
      const emailContent = {
        to: 'support@feedo.ai',
        from: user?.profile?.email,
        subject: formData.subject,
        message: formData.message
      };

      // Here you would send the email using your backend service
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));


      showToast('Email sent successfully!', 'success');
      onClose();
      setFormData({
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Failed to send email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      maxWidth: "sm",
      fullWidth: true }, /*#__PURE__*/

    React.createElement(DialogTitle, null, /*#__PURE__*/
    React.createElement(Box, { display: "flex", alignItems: "center", justifyContent: "space-between" }, /*#__PURE__*/
    React.createElement(Box, { display: "flex", alignItems: "center", gap: 1 }, /*#__PURE__*/
    React.createElement(FiMail, { size: 24 }), /*#__PURE__*/
    React.createElement(Typography, { variant: "h6" }, "Contact Support"

    )
    ), /*#__PURE__*/
    React.createElement(IconButton, { onClick: onClose, size: "small" }, /*#__PURE__*/
    React.createElement(FiX, null)
    )
    )
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit }, /*#__PURE__*/
    React.createElement(DialogContent, null, /*#__PURE__*/
    React.createElement(Box, { mb: 2 }, /*#__PURE__*/
    React.createElement(StyledTextField, {
      fullWidth: true,
      disabled: true,
      label: "From",
      value: user?.profile?.email || '',
      margin: "normal",
      InputProps: {
        sx: { height: '48px' }
      } }
    )
    ), /*#__PURE__*/

    React.createElement(Box, { mb: 2 }, /*#__PURE__*/
    React.createElement(StyledTextField, {
      fullWidth: true,
      label: "Subject",
      name: "subject",
      value: formData.subject,
      onChange: handleInputChange,
      placeholder: "How can we help you?",
      required: true,
      margin: "normal",
      InputProps: {
        sx: { height: '48px' }
      } }
    )
    ), /*#__PURE__*/

    React.createElement(Box, { mb: 2 }, /*#__PURE__*/
    React.createElement(StyledTextField, {
      fullWidth: true,
      label: "Message",
      multiline: true,
      rows: 4,
      name: "message",
      value: formData.message,
      onChange: handleInputChange,
      placeholder: "Please describe your issue or question...",
      required: true,
      margin: "normal" }
    )
    )
    ), /*#__PURE__*/

    React.createElement(DialogActions, null, /*#__PURE__*/
    React.createElement(Button, { onClick: onClose }, "Cancel"

    ), /*#__PURE__*/
    React.createElement(Button, {
      type: "submit",
      variant: "contained",
      disabled: loading },

    loading ? 'Sending...' : 'Send Email'
    )
    )
    )
    ));

};

export default EmailDialog;