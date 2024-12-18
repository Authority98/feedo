import React from 'react';
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
  CircularProgress } from
'@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import EnhanceWithAI from '../../../../../components/EnhanceWithAI/EnhanceWithAI';
import { useAuth } from '../../../../../auth/AuthContext';
import { useToast } from '../../../../../components/Toast/ToastContext';
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
fileUploading) =>
{
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  const getStyles = (option, selectedOptions, theme) => {
    return {
      fontWeight:
      selectedOptions?.indexOf(option) === -1 ?
      theme.typography.fontWeightRegular :
      theme.typography.fontWeightMedium
    };
  };

  const renderFileUpload = (questionId, groupIndex, fieldId, field = null) => {
    const previewKey = groupIndex !== undefined && fieldId !== undefined ?
    `${questionId}_${groupIndex}_${fieldId}` :
    questionId;

    const existingFile = groupIndex !== undefined && fieldId !== undefined ?
    formData[questionId]?.[groupIndex]?.[fieldId] :
    formData[questionId];

    const filePreview = filePreviews?.[previewKey];
    const isNewFile = existingFile instanceof File;
    const displayName = isNewFile ?
    existingFile?.name :
    existingFile ?
    existingFile?.name || (typeof existingFile === 'string' ? existingFile.split('/').pop() : '') :
    '';

    // Get the URL for display
    const fileUrl = isNewFile ?
    filePreview || (existingFile ? URL.createObjectURL(existingFile) : '') :
    existingFile ?
    existingFile?.url || (typeof existingFile === 'string' ? existingFile : '') :
    '';

    const isUploading = fileUploading?.[previewKey];
    const validation = field?.validation || {};
    const label = field?.label || field?.question || '';
    const required = field?.required || false;

    // Create a unique key for the input element that changes when the file is removed
    const inputKey = `${previewKey}_${existingFile ? 'has-file' : 'no-file'}`;

    return (/*#__PURE__*/
      React.createElement(Box, null, /*#__PURE__*/
      React.createElement(Typography, { variant: "body1", gutterBottom: true },
      label,
      required && /*#__PURE__*/
      React.createElement(Typography, { component: "span", color: "error" }, "*")

      ), /*#__PURE__*/
      React.createElement("input", {
        key: inputKey,
        type: "file",
        accept: validation?.fileTypes?.join(','),
        onChange: (e) => {
          if (typeof handleFileChange === 'function') {
            handleFileChange(questionId, e.target.files?.[0], groupIndex, fieldId);
          } else {
            console.error('handleFileChange is not a function:', handleFileChange);
          }
        },
        style: { display: 'none' },
        id: `file-input-${previewKey}` }
      ), /*#__PURE__*/
      React.createElement("label", { htmlFor: `file-input-${previewKey}` }, /*#__PURE__*/
      React.createElement(Button, {
        variant: "outlined",
        component: "span",
        fullWidth: true,
        sx: { mb: 1 },
        disabled: isUploading },

      isUploading && existingFile ? /*#__PURE__*/
      React.createElement(Box, { display: "flex", alignItems: "center", gap: 1 }, /*#__PURE__*/
      React.createElement(CircularProgress, { size: 16 }), /*#__PURE__*/
      React.createElement("span", null, "Uploading...")
      ) :

      displayName ? 'Change File' : 'Choose File'

      )
      ),
      displayName && /*#__PURE__*/
      React.createElement(Box, { mt: 1 }, /*#__PURE__*/
      React.createElement(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }, /*#__PURE__*/
      React.createElement(Typography, { variant: "caption", color: "textSecondary" }, "Selected file: ",
      displayName
      ), /*#__PURE__*/
      React.createElement(IconButton, {
        size: "small",
        onClick: () => {
          if (typeof handleFileChange === 'function') {
            handleFileChange(questionId, null, groupIndex, fieldId);
          } else {
            console.error('handleFileChange is not a function:', handleFileChange);
          }
        },
        sx: { color: 'error.main' },
        disabled: isUploading }, /*#__PURE__*/

      React.createElement(DeleteIcon, { fontSize: "small" })
      )
      ),
      !isNewFile && existingFile && fileUrl && /*#__PURE__*/
      React.createElement(Box, {
        sx: {
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
        } }, /*#__PURE__*/

      React.createElement("img", {
        src: fileUrl,
        alt: displayName,
        style: {
          maxWidth: '100%',
          maxHeight: '140px',
          objectFit: 'contain',
          display: 'block',
          opacity: isUploading && existingFile ? 0.5 : 1,
          transition: 'opacity 0.2s'
        } }
      ),
      isUploading && existingFile && /*#__PURE__*/
      React.createElement(Box, {
        position: "absolute",
        top: "50%",
        left: "50%",
        sx: {
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        } }, /*#__PURE__*/

      React.createElement(CircularProgress, { size: 24 }), /*#__PURE__*/
      React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Uploading..."

      )
      )

      )

      ),

      errors?.[questionId] && /*#__PURE__*/
      React.createElement(FormHelperText, { error: true }, errors[questionId])

      ));

  };

  const handleGroupRemoval = (questionId, groupIndex) => {
    handleRemoveGroup(questionId, groupIndex);
    showToast('Group removed successfully', 'success');
  };

  const handleGroupAddition = (questionId, repeaterFields) => {
    handleAddGroup(questionId, repeaterFields);
    showToast('New group added successfully', 'success');
  };

  const renderQuestion = (question) => {
    if (!question || !question.id || loading) {

      return null;
    }

    // Ensure formData exists and initialize if needed
    const safeFormData = formData || {};
    const questionValue = safeFormData[question.id];

    // Debug logging









    // Wrap the field in a Box component to handle width
    const wrapWithWidth = (component) => /*#__PURE__*/
    React.createElement(Box, {
      sx: {
        gridColumn: question.width === '50' ? 'span 1' : 'span 2'
      } },

    component
    );


    // Special case for email field
    if (question.id === 'email') {
      const isGoogleUser = user?.profile?.provider === 'google.com';
      return wrapWithWidth(/*#__PURE__*/
        React.createElement(TextField, {
          label: question.label || question.question,
          value: questionValue || user?.email || '',
          onChange: (e) => handleInputChange(question.id, e.target.value),
          disabled: isGoogleUser,
          fullWidth: true,
          variant: "outlined",
          helperText: isGoogleUser ? "Email cannot be changed for Google accounts" : "Changing your email will require you to log in again",
          sx: {
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
          } }
        )
      );
    }

    switch (question.type) {
      case 'text':
        if (question.inputType === 'textarea') {
          // Log the current value for debugging






          return wrapWithWidth(/*#__PURE__*/
            React.createElement(Box, { position: "relative" }, /*#__PURE__*/
            React.createElement(TextField, {
              multiline: true,
              minRows: 3,
              maxRows: 10,
              label: question.label || question.question,
              value: formData[question.id] || '',
              onChange: (e) => {




                handleInputChange(question.id, e.target.value);
              },
              error: !!errors?.[question.id],
              helperText: errors?.[question.id] || `${(formData[question.id] || '').length}/${question.validation?.maxLength || 500}`,
              required: question.required,
              inputProps: {
                maxLength: question.validation?.maxLength || 500
              },
              fullWidth: true,
              variant: "outlined",
              sx: {
                '& .MuiInputLabel-root': {
                  backgroundColor: 'background.paper',
                  padding: '0 8px',
                  marginLeft: '-4px'
                }
              } }
            ),
            question.enableRewrite && /*#__PURE__*/
            React.createElement(EnhanceWithAI, {
              onClick: () => {




                if (typeof handleRewrite === 'function') {
                  handleRewrite(question.id);
                } else {
                  console.error('handleRewrite is not a function:', handleRewrite);
                }
              },
              isDisabled: loading || !formData[question.id],
              isLoading: enhancingFields?.[question.id] }
            )

            )
          );
        }

        return wrapWithWidth(/*#__PURE__*/
          React.createElement(TextField, {
            label: question.label || question.question,
            value: questionValue || '',
            onChange: (e) => handleInputChange(question.id, e.target.value),
            error: !!errors?.[question.id],
            helperText: errors?.[question.id],
            required: question.required,
            inputProps: {
              maxLength: question.validation?.maxLength
            },
            fullWidth: true,
            variant: "outlined",
            sx: {
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
            } }
          )
        );

      case 'radio':
        return wrapWithWidth(/*#__PURE__*/
          React.createElement(FormControl, { error: !!errors[question.id], fullWidth: true }, /*#__PURE__*/
          React.createElement(Typography, { variant: "body1", gutterBottom: true },
          question.label || question.question,
          question.required && /*#__PURE__*/
          React.createElement(Typography, { component: "span", color: "error" }, "*"

          )

          ), /*#__PURE__*/
          React.createElement(RadioGroup, {
            value: questionValue || '',
            onChange: (e) => handleInputChange(question.id, e.target.value) },

          question.options?.map((option) => /*#__PURE__*/
          React.createElement(FormControlLabel, {
            key: option,
            value: option,
            control: /*#__PURE__*/React.createElement(Radio, null),
            label: option }
          )
          )
          ),
          errors[question.id] && /*#__PURE__*/
          React.createElement(FormHelperText, null, errors[question.id])

          )
        );

      case 'checkbox':
      case 'multipleChoice':
        return wrapWithWidth(/*#__PURE__*/
          React.createElement(FormControl, { fullWidth: true, error: !!errors[question.id] }, /*#__PURE__*/
          React.createElement(InputLabel, { id: `${question.id}-label` },
          question.label || question.question
          ), /*#__PURE__*/
          React.createElement(Select, {
            labelId: `${question.id}-label`,
            multiple: true,
            value: questionValue || [],
            onChange: (e) => handleMultiSelectChange(question.id, e),
            input: /*#__PURE__*/
            React.createElement(OutlinedInput, {
              label: question.label || question.question,
              required: question.required }
            ),

            renderValue: (selected) => /*#__PURE__*/
            React.createElement(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 } },
            selected.map((value) => /*#__PURE__*/
            React.createElement(Chip, { key: value, label: value })
            )
            ) },


          question.options?.map((option) => /*#__PURE__*/
          React.createElement(MenuItem, {
            key: option,
            value: option,
            style: getStyles(option, questionValue || [], theme) },

          option
          )
          )
          ),
          errors[question.id] && /*#__PURE__*/
          React.createElement(FormHelperText, null, errors[question.id])

          )
        );

      case 'dropdown':
      case 'select':
        return wrapWithWidth(/*#__PURE__*/
          React.createElement(FormControl, { fullWidth: true, error: !!errors[question.id] }, /*#__PURE__*/
          React.createElement(InputLabel, { required: question.required },
          question.label || question.question
          ), /*#__PURE__*/
          React.createElement(Select, {
            value: questionValue || '',
            onChange: (e) => handleInputChange(question.id, e.target.value),
            label: question.label || question.question,
            size: "medium" }, /*#__PURE__*/

          React.createElement(MenuItem, { value: "" }, /*#__PURE__*/
          React.createElement("em", null, "None")
          ),
          question.options?.map((option) => /*#__PURE__*/
          React.createElement(MenuItem, { key: option, value: option },
          option
          )
          )
          ),
          errors[question.id] && /*#__PURE__*/
          React.createElement(FormHelperText, null, errors[question.id])

          )
        );

      case 'file':
        return wrapWithWidth(renderFileUpload(question.id, undefined, undefined, question));

      case 'date':
        return wrapWithWidth(/*#__PURE__*/
          React.createElement(TextField, {
            type: "date",
            fullWidth: true,
            label: question.label || question.question,
            value: questionValue || '',
            onChange: (e) => handleInputChange(question.id, e.target.value),
            error: !!errors[question.id],
            helperText: errors[question.id],
            required: question.required,
            variant: "outlined",
            InputLabelProps: {
              shrink: true,
              required: question.required
            } }
          )
        );

      case 'repeater':
        const repeaterValue = Array.isArray(questionValue) ? questionValue : [];

        return wrapWithWidth(/*#__PURE__*/
          React.createElement(Box, null, /*#__PURE__*/
          React.createElement(Typography, { variant: "body1", gutterBottom: true },
          question.label || question.question,
          question.required && /*#__PURE__*/
          React.createElement(Typography, { component: "span", color: "error" }, "*")

          ), /*#__PURE__*/

          React.createElement(Stack, { spacing: 2 },
          repeaterValue.map((group, groupIndex) => /*#__PURE__*/
          React.createElement(Card, { key: groupIndex, variant: "outlined" }, /*#__PURE__*/
          React.createElement(CardContent, null, /*#__PURE__*/
          React.createElement(Stack, { spacing: 2 }, /*#__PURE__*/
          React.createElement(Box, {
            display: "grid",
            gap: 2,
            sx: {
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            } },

          question.repeaterFields?.map((field) => /*#__PURE__*/
          React.createElement(Box, {
            key: field.id,
            sx: {
              gridColumn: field.width === '50' ? 'span 1' : 'span 2'
            } },

          renderGroupField(field, question.id, groupIndex)
          )
          )
          ),

          question.allowMultipleGroups && repeaterValue.length > 1 && /*#__PURE__*/
          React.createElement(Box, { display: "flex", justifyContent: "flex-end", mt: 1 }, /*#__PURE__*/
          React.createElement(Button, {
            size: "small",
            onClick: () => handleGroupRemoval(question.id, groupIndex),
            color: "error",
            startIcon: /*#__PURE__*/React.createElement(DeleteIcon, null),
            variant: "outlined" },
          "Remove Group"

          )
          )

          )
          )
          )
          ),

          question.allowMultipleGroups && /*#__PURE__*/
          React.createElement(Button, {
            startIcon: /*#__PURE__*/React.createElement(AddIcon, null),
            onClick: () => handleGroupAddition(question.id, question.repeaterFields || []),
            disabled: repeaterValue.length >= (question.validation?.maxGroups || 10),
            variant: "outlined",
            fullWidth: true },
          "Add New Group"

          )

          ),
          errors?.[question.id] && /*#__PURE__*/
          React.createElement(FormHelperText, { error: true }, errors[question.id])

          )
        );

      case 'phone':
        return wrapWithWidth(/*#__PURE__*/
          React.createElement(Box, null, /*#__PURE__*/
          React.createElement(Typography, { variant: "body1", gutterBottom: true },
          question.label || question.question,
          question.required && /*#__PURE__*/
          React.createElement(Typography, { component: "span", color: "error" }, "*")

          ), /*#__PURE__*/
          React.createElement(PhoneNumberInput, {
            value: questionValue || { countryCode: '+1', country: 'United States', number: '' },
            onChange: (value) => handleInputChange(question.id, value),
            required: question.required,
            error: errors?.[question.id] }
          )
          )
        );

      default:
        return null;
    }
  };

  const renderGroupField = (field, questionId, groupIndex) => {
    if (!field || !field.id || loading) {

      return null;
    }

    const safeFormData = formData || {};
    const groupData = Array.isArray(safeFormData[questionId]) ? safeFormData[questionId][groupIndex] : {};
    const fieldValue = groupData?.[field.id];
    const error = errors?.[questionId]?.[groupIndex]?.[field.id];









    switch (field.type) {
      case 'text':
        return (/*#__PURE__*/
          React.createElement(TextField, {
            fullWidth: true,
            label: field.label,
            value: fieldValue || '',
            onChange: (e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value),
            error: !!error,
            helperText: error,
            required: field.required,
            variant: "outlined",
            sx: {
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
            } }
          ));


      case 'textarea':
        return (/*#__PURE__*/
          React.createElement(Box, { position: "relative" }, /*#__PURE__*/
          React.createElement(TextField, {
            multiline: true,
            minRows: 3,
            maxRows: 10,
            label: field.label,
            value: fieldValue || '',
            onChange: (e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value),
            error: !!error,
            helperText: error || `${(fieldValue || '').length}/${field.validation?.maxLength || 500}`,
            required: field.required,
            inputProps: {
              maxLength: field.validation?.maxLength || 500
            },
            fullWidth: true,
            variant: "outlined" }
          ),
          field.enableRewrite && /*#__PURE__*/
          React.createElement(EnhanceWithAI, {
            onClick: () => {
              if (typeof handleRewrite === 'function') {
                handleRewrite(questionId, groupIndex, field.id);
              } else {
                console.error('handleRewrite is not a function:', handleRewrite);
              }
            },
            isDisabled: loading || !fieldValue,
            isLoading: enhancingFields?.[questionId] }
          )

          ));


      case 'date':
        return (/*#__PURE__*/
          React.createElement(TextField, {
            type: "date",
            fullWidth: true,
            label: field.label,
            value: fieldValue || '',
            onChange: (e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value),
            error: !!error,
            helperText: error,
            required: field.required,
            variant: "outlined",
            InputLabelProps: {
              shrink: true,
              required: field.required
            } }
          ));


      case 'dropdown':
      case 'select':
        return (/*#__PURE__*/
          React.createElement(FormControl, { fullWidth: true, error: !!error }, /*#__PURE__*/
          React.createElement(InputLabel, { required: field.required }, field.label), /*#__PURE__*/
          React.createElement(Select, {
            value: fieldValue || '',
            onChange: (e) => handleGroupFieldChange(questionId, groupIndex, field.id, e.target.value),
            label: field.label,
            size: "medium" }, /*#__PURE__*/

          React.createElement(MenuItem, { value: "" }, /*#__PURE__*/React.createElement("em", null, "None")),
          field.options?.map((option) => /*#__PURE__*/
          React.createElement(MenuItem, { key: option, value: option }, option)
          )
          ),
          error && /*#__PURE__*/React.createElement(FormHelperText, null, error)
          ));


      case 'multipleChoice':
        const multiChoiceValue = Array.isArray(fieldValue) ? fieldValue : [];
        return (/*#__PURE__*/
          React.createElement(FormControl, { fullWidth: true, error: !!error }, /*#__PURE__*/
          React.createElement(InputLabel, { id: `${field.id}-${groupIndex}-label` },
          field.label
          ), /*#__PURE__*/
          React.createElement(Select, {
            labelId: `${field.id}-${groupIndex}-label`,
            multiple: true,
            value: multiChoiceValue,
            onChange: (e) => {
              const newValue = typeof e.target.value === 'string' ?
              e.target.value.split(',') :
              e.target.value;
              handleGroupFieldChange(questionId, groupIndex, field.id, newValue);
            },
            input: /*#__PURE__*/
            React.createElement(OutlinedInput, {
              label: field.label,
              required: field.required }
            ),

            renderValue: (selected) => /*#__PURE__*/
            React.createElement(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 } },
            selected.map((value) => /*#__PURE__*/
            React.createElement(Chip, { key: value, label: value })
            )
            ) },


          field.options?.map((option) => /*#__PURE__*/
          React.createElement(MenuItem, {
            key: option,
            value: option,
            style: getStyles(option, multiChoiceValue, theme) },

          option
          )
          )
          ),
          error && /*#__PURE__*/React.createElement(FormHelperText, null, error)
          ));


      case 'file':
        return renderFileUpload(questionId, groupIndex, field.id, field);

      case 'phone':
        return (/*#__PURE__*/
          React.createElement(Box, null, /*#__PURE__*/
          React.createElement(Typography, { variant: "body1", gutterBottom: true },
          field.label,
          field.required && /*#__PURE__*/
          React.createElement(Typography, { component: "span", color: "error" }, "*")

          ), /*#__PURE__*/
          React.createElement(PhoneNumberInput, {
            value: fieldValue || { countryCode: '+1', country: 'United States', number: '' },
            onChange: (value) => handleGroupFieldChange(questionId, groupIndex, field.id, value),
            required: field.required,
            error: error }
          )
          ));


      default:
        return null;
    }
  };

  return {
    renderQuestion,
    renderGroupField
  };
};