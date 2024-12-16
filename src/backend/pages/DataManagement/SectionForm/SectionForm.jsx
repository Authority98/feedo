/**
 * SectionForm Component
 * 
 * Features:
 * - Dynamic form generation based on section questions
 * - Handles all question types (text, radio, checkbox, etc.)
 * - Form validation based on question configuration
 * - Real-time validation and error handling
 */

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFormData } from './hooks/useFormData';
import { useFormRendering } from './hooks/useFormRendering';
import {
  Typography,
  Box,
  Paper,
  Stack,
  Button
} from '@mui/material';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import EnhanceWithAI from '../../../../components/EnhanceWithAI/EnhanceWithAI';
import PhoneNumberInput from '../../../../components/PhoneNumberInput/PhoneNumberInput';

const SectionForm = ({ section, profileType, formData: initialFormData }) => {
  const theme = useTheme();
  const {
    formData,
    errors,
    loading,
    fileUploading,
    enhancingFields,
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup,
    handleSubmit,
    handleFileChange,
    filePreviews,
    handleRewrite,
    setErrors
  } = useFormData(section, profileType, initialFormData);

  const { renderQuestion } = useFormRendering(
    section,
    formData,
    errors,
    loading,
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup,
    handleRewrite,
    handleFileChange,
    filePreviews,
    enhancingFields,
    fileUploading
  );

  if (!section || !section.questions) {
    return null;
  }

  return (
    <Paper elevation={0}>
      <Box p={2} pt={0.5}>
        {section.description && (
          <Box mb={2} pb={1} borderBottom={1} borderColor="divider">
            <Typography variant="h6" gutterBottom>
              {section.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {section.description}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <Box>
            <Box
              display="grid"
              gap={2}
              sx={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                '& > *': {
                  minWidth: 0 // This ensures the grid items don't overflow
                }
              }}
            >
              {section.questions?.map((question) => (
                <React.Fragment key={question.id}>
                  {renderQuestion(question)}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        )}

        {errors.submit && (
          <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
            {errors.submit}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SectionForm; 