import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import EnhanceWithAI from '../../../../../components/EnhanceWithAI/EnhanceWithAI';
import PhoneNumberInput from '../../../../../components/PhoneNumberInput/PhoneNumberInput';

const renderField = (question, value, handleChange, handleRewrite, enhancingFields) => {
  switch (question.type) {
    case 'text':
      if (question.inputType === 'textarea') {
        return (
          <Box className="textarea-field" sx={{ position: 'relative' }}>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={value || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={`Enter your ${question.question.toLowerCase()}`}
              required={question.required}
              variant="outlined"
              sx={{ mb: question.enableRewrite ? 2 : 0 }}
            />
            {question.enableRewrite && (
              <EnhanceWithAI
                text={value || ''}
                onRewrite={(enhancedText) => handleRewrite(question.id, enhancedText)}
                isLoading={enhancingFields[question.id]}
              />
            )}
          </Box>
        );
      }
      return (
        <TextField
          fullWidth
          value={value || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          placeholder={`Enter your ${question.question.toLowerCase()}`}
          required={question.required}
          variant="outlined"
        />
      );

    case 'phone':
      return (
        <PhoneNumberInput
          value={value || { countryCode: '+1', country: 'United States', number: '' }}
          onChange={(newValue) => handleChange(question.id, newValue)}
          required={question.required}
          placeholder={question.example || { countryCode: '+1', country: 'United States', number: '' }}
        />
      );

    case 'date':
      return (
        <TextField
          type="date"
          fullWidth
          value={value || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          required={question.required}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      );

    case 'multipleChoice':
      return (
        <Box className="checkbox-group">
          {question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(option);
                    } else {
                      const index = newValue.indexOf(option);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    handleChange(question.id, newValue);
                  }}
                  required={question.required && (!value || value.length === 0)}
                />
              }
              label={option}
            />
          ))}
        </Box>
      );

    case 'dropdown':
      return (
        <FormControl fullWidth variant="outlined">
          <InputLabel>{question.question}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            required={question.required}
            label={question.question}
          >
            <MenuItem value="">
              <em>Select an option</em>
            </MenuItem>
            {question.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'file':
      return (
        <Box className="file-upload-field">
          <input
            type="file"
            onChange={(e) => handleChange(question.id, e.target.files[0])}
            required={question.required && !value}
            style={{ display: 'none' }}
            id={`file-input-${question.id}`}
          />
          <label htmlFor={`file-input-${question.id}`}>
            <Button
              variant="outlined"
              component="span"
              fullWidth
            >
              Choose File
            </Button>
          </label>
          {value && value.url && (
            <Box className="file-preview" mt={1}>
              <a href={value.url} target="_blank" rel="noopener noreferrer">
                {value.name}
              </a>
            </Box>
          )}
        </Box>
      );

    default:
      return null;
  }
};

const renderGroupField = (field, value, onChange, groupIndex, handleRewrite, enhancingFields) => {
  // Similar updates to renderField, but for group fields
  // ... (keeping the existing logic but updating to JSX syntax)
};

const FormFields = ({ questions, formData, handlers, loading, fileUploading, enhancingFields, filePreviews }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
        '& .MuiFormControl-root': {
          minHeight: (theme) => theme.spacing(7)
        }
      }}
    >
      {questions.map((question) => (
        <Box
          key={question.id}
          sx={{
            position: 'relative'
          }}
        >
          {renderField(
            question,
            formData[question.id],
            handlers.handleInputChange,
            handlers.handleRewrite,
            enhancingFields
          )}
        </Box>
      ))}
    </Box>
  );
};

export { renderField, renderGroupField, FormFields };