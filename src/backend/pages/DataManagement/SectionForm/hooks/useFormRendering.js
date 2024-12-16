import { useTheme } from '@mui/material/styles';
import {
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  OutlinedInput,
  Chip,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import EnhanceWithAI from '../../../../../components/EnhanceWithAI/EnhanceWithAI';
import { useAuth } from '../../../../../auth/AuthContext';
import PhoneNumberInput from '../../../../../components/PhoneNumberInput/PhoneNumberInput';

export const useFormRendering = (
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
) => {
  const theme = useTheme();
  const { user } = useAuth();

  const getStyles = (option, selectedOptions, theme) => {
    return {
      fontWeight:
        selectedOptions?.indexOf(option) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const renderFileUpload = (questionId, groupIndex, fieldId, field = null) => {
    const previewKey = groupIndex !== undefined && fieldId !== undefined
      ? `${questionId}_${groupIndex}_${fieldId}`
      : questionId;

    const existingFile = groupIndex !== undefined && fieldId !== undefined
      ? formData[questionId]?.[groupIndex]?.[fieldId]
      : formData[questionId];

    const filePreview = filePreviews?.[previewKey];
    const isNewFile = existingFile instanceof File;
    const displayName = isNewFile 
      ? existingFile?.name 
      : existingFile 
        ? (existingFile?.name || (typeof existingFile === 'string' ? existingFile.split('/').pop() : ''))
        : '';

    // Get the URL for display
    const fileUrl = isNewFile 
      ? (filePreview || (existingFile ? URL.createObjectURL(existingFile) : ''))
      : existingFile
        ? (existingFile?.url || (typeof existingFile === 'string' ? existingFile : ''))
        : '';

    const isUploading = fileUploading?.[previewKey];
    const validation = field?.validation || {};
    const label = field?.label || (field?.question || '');
    const required = field?.required || false;

    // Create a unique key for the input element that changes when the file is removed
    const inputKey = `${previewKey}_${existingFile ? 'has-file' : 'no-file'}`;

    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          {label}
          {required && (
            <Typography component="span" color="error">*</Typography>
          )}
        </Typography>
        <input
          key={inputKey}
          type="file"
          accept={validation?.fileTypes?.join(',')}
          onChange={(e) => {
            if (typeof handleFileChange === 'function') {
              handleFileChange(questionId, e.target.files?.[0], groupIndex, fieldId);
            } else {
              console.error('handleFileChange is not a function:', handleFileChange);
            }
          }}
          style={{ display: 'none' }}
          id={`file-input-${previewKey}`}
        />
        <label htmlFor={`file-input-${previewKey}`}>
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={{ mb: 1 }}
            disabled={isUploading}
          >
            {isUploading && existingFile ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} />
                <span>Uploading...</span>
              </Box>
            ) : (
              displayName ? 'Change File' : 'Choose File'
            )}
          </Button>
        </label>
        {displayName && (
          <Box mt={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="textSecondary">
                Selected file: {displayName}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => {
                  if (typeof handleFileChange === 'function') {
                    handleFileChange(questionId, null, groupIndex, fieldId);
                  } else {
                    console.error('handleFileChange is not a function:', handleFileChange);
                  }
                }}
                sx={{ color: 'error.main' }}
                disabled={isUploading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            {!isNewFile && existingFile && fileUrl && (
              <Box 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: '150px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1,
                  bgcolor: 'background.paper',
                  position: 'relative'
                }}
              >
                <img 
                  src={fileUrl} 
                  alt={displayName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '140px',
                    objectFit: 'contain',
                    display: 'block',
                    opacity: isUploading && existingFile ? 0.5 : 1,
                    transition: 'opacity 0.2s'
                  }}
                />
                {isUploading && existingFile && (
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CircularProgress size={24} />
                    <Typography variant="caption" color="text.secondary">
                      Uploading...
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
        {errors?.[questionId] && (
          <FormHelperText error>{errors[questionId]}</FormHelperText>
        )}
      </Box>
    );
  };

  const renderQuestion = (question) => {
    if (!question || !question.id || loading) {
      console.log('Skipping question render - invalid question:', question);
      return null;
    }

    // Ensure formData exists and initialize if needed
    const safeFormData = formData || {};
    const questionValue = safeFormData[question.id];

    // Debug logging
    console.log('Rendering question:', {
      id: question.id,
      type: question.type,
      inputType: question.inputType,
      enableRewrite: question.enableRewrite,
      value: questionValue,
      width: question.width
    });

    // Wrap the field in a Box component to handle width
    const wrapWithWidth = (component) => (
      <Box
        sx={{
          gridColumn: question.width === '50' ? 'span 1' : 'span 2'
        }}
      >
        {component}
      </Box>
    );

    // Special case for email field
    if (question.id === 'email') {
      const isGoogleUser = user?.profile?.provider === 'google.com';
      return wrapWithWidth(
        <TextField
          label={question.label || question.question}
          value={questionValue || user?.email || ''}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          disabled={isGoogleUser}
          fullWidth
          variant="outlined"
          helperText={isGoogleUser ? "Email cannot be changed for Google accounts" : "Changing your email will require you to log in again"}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              minHeight: '56px',
              backgroundColor: 'background.paper',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.87)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            },
            '& .MuiInputBase-input': {
              padding: '16.5px 14px',
              height: 'auto'
            },
            '& .MuiInputLabel-root': {
              backgroundColor: 'background.paper',
              padding: '0 8px',
              marginLeft: '-4px'
            }
          }}
        />
      );
    }

    switch (question.type) {
      case 'text':
        if (question.inputType === 'textarea') {
          // Log the current value for debugging
          console.log('Rendering textarea:', {
            questionId: question.id,
            value: questionValue,
            formDataValue: formData[question.id]
          });

          return wrapWithWidth(
            <Box position="relative">
              <TextField
                multiline
                minRows={3}
                maxRows={10}
                label={question.label || question.question}
                value={formData[question.id] || ''}
                onChange={(e) => {
                  console.log('Textarea onChange:', {
                    questionId: question.id,
                    newValue: e.target.value
                  });
                  handleInputChange(question.id, e.target.value);
                }}
                error={!!errors?.[question.id]}
                helperText={errors?.[question.id] || `${(formData[question.id] || '').length}/${question.validation?.maxLength || 500}`}
                required={question.required}
                inputProps={{
                  maxLength: question.validation?.maxLength || 500
                }}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiInputLabel-root': {
                    backgroundColor: 'background.paper',
                    padding: '0 8px',
                    marginLeft: '-4px'
                  }
                }}
              />
              {question.enableRewrite && (
                <EnhanceWithAI
                  onClick={() => {
                    console.log('Enhance button clicked:', {
                      questionId: question.id,
                      currentValue: formData[question.id]
                    });
                    if (typeof handleRewrite === 'function') {
                      handleRewrite(question.id);
                    } else {
                      console.error('handleRewrite is not a function:', handleRewrite);
                    }
                  }}
                  isDisabled={loading || !formData[question.id]}
                  isLoading={enhancingFields?.[question.id]}
                />
              )}
            </Box>
          );
        }
        
        return wrapWithWidth(
          <TextField
            label={question.label || question.question}
            value={questionValue || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            error={!!errors?.[question.id]}
            helperText={errors?.[question.id]}
            required={question.required}
            inputProps={{
              maxLength: question.validation?.maxLength
            }}
            fullWidth
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                minHeight: '56px',
                backgroundColor: 'background.paper',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.87)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputBase-input': {
                padding: '16.5px 14px',
                height: 'auto'
              },
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                padding: '0 8px',
                marginLeft: '-4px'
              }
            }}
          />
        );

      case 'radio':
        return wrapWithWidth(
          <FormControl error={!!errors[question.id]} fullWidth>
            <Typography variant="body1" gutterBottom>
              {question.label || question.question}
              {question.required && (
                <Typography component="span" color="error">
                  *
                </Typography>
              )}
            </Typography>
            <RadioGroup
              value={questionValue || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {errors[question.id] && (
              <FormHelperText>{errors[question.id]}</FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
      case 'multipleChoice':
        return wrapWithWidth(
          <FormControl fullWidth error={!!errors[question.id]}>
            <InputLabel id={`${question.id}-label`}>
              {question.label || question.question}
            </InputLabel>
            <Select
              labelId={`${question.id}-label`}
              multiple
              value={questionValue || []}
              onChange={(e) => handleMultiSelectChange(question.id, e)}
              input={
                <OutlinedInput 
                  label={question.label || question.question}
                  required={question.required}
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {question.options?.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  style={getStyles(option, questionValue || [], theme)}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors[question.id] && (
              <FormHelperText>{errors[question.id]}</FormHelperText>
            )}
          </FormControl>
        );

      case 'dropdown':
      case 'select':
        return wrapWithWidth(
          <FormControl fullWidth error={!!errors[question.id]}>
            <InputLabel required={question.required}>
              {question.label || question.question}
            </InputLabel>
            <Select
              value={questionValue || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              label={question.label || question.question}
              size="medium"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {question.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors[question.id] && (
              <FormHelperText>{errors[question.id]}</FormHelperText>
            )}
          </FormControl>
        );

      case 'file':
        return wrapWithWidth(renderFileUpload(question.id, undefined, undefined, question));

      case 'date':
        return wrapWithWidth(
          <TextField
            type="date"
            fullWidth
            label={question.label || question.question}
            value={questionValue || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            error={!!errors[question.id]}
            helperText={errors[question.id]}
            required={question.required}
            variant="outlined"
            InputLabelProps={{ 
              shrink: true,
              required: question.required 
            }}
          />
        );

      case 'repeater':
        const repeaterValue = Array.isArray(questionValue) ? questionValue : [];
        
        return wrapWithWidth(
          <Box>
            <Typography variant="body1" gutterBottom>
              {question.label || question.question}
              {question.required && (
                <Typography component="span" color="error">*</Typography>
              )}
            </Typography>
            
            <Stack spacing={2}>
              {repeaterValue.map((group, groupIndex) => (
                <Card key={groupIndex} variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="flex-end">
                        {question.allowMultipleGroups && repeaterValue.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveGroup(question.id, groupIndex)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Box
                        display="grid"
                        gap={2}
                        sx={{
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                        }}
                      >
                        {question.repeaterFields?.map((field) => (
                          <Box
                            key={field.id}
                            sx={{
                              gridColumn: field.width === '50' ? 'span 1' : 'span 2'
                            }}
                          >
                            {renderGroupField(field, question.id, groupIndex)}
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {question.allowMultipleGroups && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddGroup(question.id, question.repeaterFields || [])}
                  disabled={repeaterValue.length >= (question.validation?.maxGroups || 10)}
                  variant="outlined"
                  fullWidth
                >
                  Add New Group
                </Button>
              )}
            </Stack>
            {errors?.[question.id] && (
              <FormHelperText error>{errors[question.id]}</FormHelperText>
            )}
          </Box>
        );

      case 'phone':
        return wrapWithWidth(
          <Box>
            <Typography variant="body1" gutterBottom>
              {question.label || question.question}
              {question.required && (
                <Typography component="span" color="error">*</Typography>
              )}
            </Typography>
            <PhoneNumberInput
              value={questionValue || { countryCode: '+1', country: 'United States', number: '' }}
              onChange={(value) => handleInputChange(question.id, value)}
              required={question.required}
              error={errors?.[question.id]}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const renderGroupField = (field, questionId, groupIndex) => {
    if (!field || !field.id || loading) {
      console.log('Skipping group field render - invalid field:', field);
      return null;
    }

    const safeFormData = formData || {};
    const groupData = Array.isArray(safeFormData[questionId]) ? safeFormData[questionId][groupIndex] : {};
    const fieldValue = groupData?.[field.id];
    const error = errors?.[questionId]?.[groupIndex]?.[field.id];

    console.log('Rendering group field:', {
      questionId,
      groupIndex,
      fieldId: field.id,
      value: fieldValue,
      error
    });

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={fieldValue || ''}
            onChange={(e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                minHeight: '56px',
                backgroundColor: 'background.paper',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.87)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputBase-input': {
                padding: '16.5px 14px',
                height: 'auto'
              },
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                padding: '0 8px',
                marginLeft: '-4px'
              }
            }}
          />
        );

      case 'textarea':
        return (
          <Box position="relative">
            <TextField
              multiline
              minRows={3}
              maxRows={10}
              label={field.label}
              value={fieldValue || ''}
              onChange={(e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value)}
              error={!!error}
              helperText={error || `${(fieldValue || '').length}/${field.validation?.maxLength || 500}`}
              required={field.required}
              inputProps={{
                maxLength: field.validation?.maxLength || 500
              }}
              fullWidth
              variant="outlined"
            />
            {field.enableRewrite && (
              <EnhanceWithAI
                onClick={() => {
                  if (typeof handleRewrite === 'function') {
                    handleRewrite(questionId, groupIndex, field.id);
                  } else {
                    console.error('handleRewrite is not a function:', handleRewrite);
                  }
                }}
                isDisabled={loading || !fieldValue}
                isLoading={enhancingFields?.[questionId]}
              />
            )}
          </Box>
        );

      case 'date':
        return (
          <TextField
            type="date"
            fullWidth
            label={field.label}
            value={fieldValue || ''}
            onChange={(e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            variant="outlined"
            InputLabelProps={{ 
              shrink: true,
              required: field.required 
            }}
          />
        );

      case 'dropdown':
      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Select
              value={fieldValue || ''}
              onChange={(e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value)}
              label={field.label}
              size="medium"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'multipleChoice':
        const multiChoiceValue = Array.isArray(fieldValue) ? fieldValue : [];
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel id={`${field.id}-${groupIndex}-label`}>
              {field.label}
            </InputLabel>
            <Select
              labelId={`${field.id}-${groupIndex}-label`}
              multiple
              value={multiChoiceValue}
              onChange={(e) => {
                const newValue = typeof e.target.value === 'string' 
                  ? e.target.value.split(',') 
                  : e.target.value;
                handleGroupFieldChange(questionId, groupIndex, field.id, newValue);
              }}
              input={
                <OutlinedInput 
                  label={field.label}
                  required={field.required}
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  style={getStyles(option, multiChoiceValue, theme)}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'file':
        return renderFileUpload(questionId, groupIndex, field.id, field);

      case 'phone':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              {field.label}
              {field.required && (
                <Typography component="span" color="error">*</Typography>
              )}
            </Typography>
            <PhoneNumberInput
              value={fieldValue || { countryCode: '+1', country: 'United States', number: '' }}
              onChange={(value) => handleGroupFieldChange(questionId, groupIndex, field.id, value)}
              required={field.required}
              error={error}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return {
    renderQuestion,
    renderGroupField
  };
}; 