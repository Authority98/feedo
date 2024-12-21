import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { FiPaperclip, FiFile, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../Toast/ToastContext';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatFileSize } from '../../utils/formatters';

const QuestionDialog = ({ open, onClose, currentSection }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    details: ''
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalSize = [...files, ...selectedFiles].reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        files: 'Total file size cannot exceed 10MB'
      }));
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setErrors((prev) => ({ ...prev, files: '' }));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Question title is required';
    }
    if (!formData.details.trim()) {
      newErrors.details = 'Question details are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setUploading(true);
        // TODO: Implement question submission with file upload
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated upload
        showToast('Question submitted successfully', 'success');
        onClose();
        // Reset form
        setFormData({ title: '', details: '' });
        setFiles([]);
      } catch (error) {
        console.error('Error submitting question:', error);
        showToast('Failed to submit question. Please try again.', 'error');
        setErrors((prev) => ({
          ...prev,
          submit: 'Failed to submit question. Please try again.'
        }));
      } finally {
        setUploading(false);
      }
    } else {
      showToast('Please fill in all required fields', 'error');
    }
  };

  return (/*#__PURE__*/
    React.createElement(Dialog, {
      open: open,
      onClose: !uploading ? onClose : undefined,
      maxWidth: "sm",
      fullWidth: true,
      TransitionComponent: Transition }, /*#__PURE__*/

    React.createElement(DialogTitle, { sx: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      } }, /*#__PURE__*/
    React.createElement(Box, null, /*#__PURE__*/
    React.createElement(Typography, { variant: "h6" }, "Ask a Question"),
    currentSection && /*#__PURE__*/
    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Section: ",
    currentSection.label
    )

    ),
    !uploading && /*#__PURE__*/
    React.createElement(IconButton, { onClick: onClose, size: "small" }, /*#__PURE__*/
    React.createElement(FiX, null)
    )

    ), /*#__PURE__*/

    React.createElement(DialogContent, null, /*#__PURE__*/
    React.createElement(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 3, pt: 1 } }, /*#__PURE__*/
    React.createElement(TextField, {
      name: "title",
      label: "Question Title",
      fullWidth: true,
      value: formData.title,
      onChange: handleChange,
      error: !!errors.title,
      helperText: errors.title,
      placeholder: "What would you like to know?",
      disabled: uploading,
      sx: {
        '& .MuiInputBase-root': {
          height: '48px'
        },
        '& .MuiInputBase-input': {
          height: '48px',
          boxSizing: 'border-box',
          padding: '0 14px',
          border: 'none',
          borderRadius: 0,
          '&:focus': {
            border: 'none',
            outline: 'none'
          }
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid',
          borderColor: 'divider'
        }
      } }
    ), /*#__PURE__*/

    React.createElement(TextField, {
      name: "details",
      label: "Question Details",
      multiline: true,
      rows: 4,
      fullWidth: true,
      value: formData.details,
      onChange: handleChange,
      error: !!errors.details,
      helperText: errors.details,
      placeholder: "Provide more details about your question...",
      disabled: uploading }
    ), /*#__PURE__*/

    React.createElement(Box, null, /*#__PURE__*/
    React.createElement("input", {
      type: "file",
      multiple: true,
      ref: fileInputRef,
      onChange: handleFileSelect,
      style: { display: 'none' },
      accept: "image/*,.pdf,.doc,.docx",
      disabled: uploading }
    ), /*#__PURE__*/

    React.createElement(Box, {
      sx: {
        border: '2px dashed',
        borderColor: errors.files ? 'error.main' : 'primary.main',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover'
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      },
      onClick: () => fileInputRef.current?.click() }, /*#__PURE__*/

    React.createElement(FiUploadCloud, {
      size: 32,
      style: {
        color: errors.files ? '#d32f2f' : '#1976d2',
        marginBottom: '4px'
      } }
    ), /*#__PURE__*/
    React.createElement(Typography, { variant: "subtitle1", sx: { mt: 1 } }, "Click to upload or drag and drop"

    ), /*#__PURE__*/
    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Supports: Images, PDF, DOC (max 10MB)"

    )
    ),

    files.length > 0 && /*#__PURE__*/
    React.createElement(Box, { sx: { mt: 2, display: 'flex', flexDirection: 'column', gap: 1 } },
    files.map((file, index) => /*#__PURE__*/
    React.createElement(Box, {
      key: index,
      sx: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      } }, /*#__PURE__*/

    React.createElement(FiFile, null), /*#__PURE__*/
    React.createElement(Box, { sx: { flex: 1, minWidth: 0 } }, /*#__PURE__*/
    React.createElement(Typography, { variant: "body2", noWrap: true }, file.name), /*#__PURE__*/
    React.createElement(Typography, { variant: "caption", color: "text.secondary" },
    formatFileSize(file.size)
    )
    ),
    !uploading && /*#__PURE__*/
    React.createElement(IconButton, {
      size: "small",
      onClick: () => removeFile(index) }, /*#__PURE__*/

    React.createElement(FiTrash2, { size: 16 })
    )

    )
    )
    )

    )
    )
    ),

    uploading && /*#__PURE__*/React.createElement(LinearProgress, null), /*#__PURE__*/

    React.createElement(DialogActions, { sx: { p: 2.5, pt: 1.5 } }, /*#__PURE__*/
    React.createElement(Button, {
      onClick: onClose,
      disabled: uploading },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement(Button, {
      onClick: handleSubmit,
      variant: "contained",
      disabled: uploading,
      startIcon: uploading ? null : /*#__PURE__*/React.createElement(FiPaperclip, null) },

    uploading ? 'Submitting...' : 'Submit Question'
    )
    )
    ));

};

export default QuestionDialog;