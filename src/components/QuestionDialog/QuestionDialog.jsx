/**
 * QuestionDialog Component
 * Features:
 * - Material UI dialog design
 * - Question form with validation
 * - File upload support
 * - Rich text editor for details
 */

import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Slide
} from '@mui/material';
import { 
  FiX, 
  FiUploadCloud, 
  FiFile, 
  FiTrash2, 
  FiPaperclip,
  FiAlertCircle
} from 'react-icons/fi';
import { useToast } from '../../components/Toast/ToastContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalSize = [...files, ...selectedFiles].reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > 10 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        files: 'Total file size cannot exceed 10MB'
      }));
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated upload
        showToast('Question submitted successfully', 'success');
        onClose();
        // Reset form
        setFormData({ title: '', details: '' });
        setFiles([]);
      } catch (error) {
        console.error('Error submitting question:', error);
        showToast('Failed to submit question. Please try again.', 'error');
        setErrors(prev => ({
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog 
      open={open} 
      onClose={!uploading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6">Ask a Question</Typography>
          {currentSection && (
            <Typography variant="caption" color="text.secondary">
              Section: {currentSection.label}
            </Typography>
          )}
        </Box>
        {!uploading && (
          <IconButton onClick={onClose} size="small">
            <FiX />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            name="title"
            label="Question Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="What would you like to know?"
            disabled={uploading}
            sx={{
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
            }}
          />

          <TextField
            name="details"
            label="Question Details"
            multiline
            rows={4}
            fullWidth
            value={formData.details}
            onChange={handleChange}
            error={!!errors.details}
            helperText={errors.details}
            placeholder="Provide more details about your question..."
            disabled={uploading}
          />

          <Box>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.doc,.docx"
              disabled={uploading}
            />
            
            <Box 
              sx={{ 
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
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUploadCloud 
                size={32} 
                style={{ 
                  color: errors.files ? '#d32f2f' : '#1976d2',
                  marginBottom: '4px'
                }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports: Images, PDF, DOC (max 10MB)
              </Typography>
            </Box>

            {files.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <FiFile />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    {!uploading && (
                      <IconButton 
                        size="small" 
                        onClick={() => removeFile(index)}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {uploading && <LinearProgress />}

      <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
        <Button 
          onClick={onClose}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading}
          startIcon={uploading ? null : <FiPaperclip />}
        >
          {uploading ? 'Submitting...' : 'Submit Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog; 