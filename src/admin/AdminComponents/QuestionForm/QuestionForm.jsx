/**
 * QuestionForm Component
 * 
 * Features:
 * - Dynamic form generation based on question type
 * - Form validation and error handling
 * - Support for all question types including repeater fields
 * - Real-time validation feedback
 */

import React, { useState, useEffect } from 'react';
import AdminButton from '../AdminButton/AdminButton';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import './QuestionForm.css';
import { FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import EnhanceWithAI from '../../../components/EnhanceWithAI/EnhanceWithAI';
import PhoneNumberInput from '../../../components/PhoneNumberInput/PhoneNumberInput';

const QuestionForm = ({
  questionType,
  onSubmit,
  onCancel,
  initialData,
  profileType,
  sectionId
}) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    question: questionType === 'phone' ? '' : '',
    type: questionType,
    required: false,
    order: 0,
    width: '100',
    options: [''],
    inputType: 'text',
    enableRewrite: false,
    allowMultipleGroups: false,
    groupFields: [
    {
      id: Date.now(),
      label: '',
      type: 'text',
      required: false,
      width: '100',
      options: ['']
    }],

    validation: {
      minLength: 0,
      maxLength: 100,
      pattern: '',
      minGroups: 1,
      maxGroups: 1
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        inputType: initialData.inputType || 'text',
        enableRewrite: initialData.enableRewrite || false,
        options: initialData.options || [''],
        allowMultipleGroups: initialData.allowMultipleGroups ?? false,
        groupFields: initialData.repeaterFields?.map((field) => ({
          ...field,
          options: ['dropdown', 'singleChoice', 'multipleChoice'].includes(field.type) ?
          field.options || [''] :
          ['']
        })) || [
        {
          id: Date.now(),
          label: '',
          type: 'text',
          required: false,
          width: '100',
          options: ['']
        }],

        validation: {
          ...initialData.validation,
          minLength: initialData.validation?.minLength || 0,
          maxLength: initialData.validation?.maxLength || (
          initialData.inputType === 'textarea' ? 500 : 100),
          minGroups: initialData.validation?.minGroups ||
          initialData.validation?.minRepeats || 1,
          maxGroups: initialData.validation?.maxGroups ||
          initialData.validation?.maxRepeats || (
          initialData.allowMultipleGroups ? 10 : 1)
        }
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (questionType !== 'phone' && !formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (['multipleChoice', 'checkbox', 'dropdown', 'radio'].includes(questionType)) {
      if (formData.options.length < 2) {
        newErrors.options = 'At least two options are required';
      }
      if (formData.options.some((opt) => !opt.trim())) {
        newErrors.options = 'All options must have a value';
      }
    }

    if (formData.validation) {
      if (formData.validation.minLength > formData.validation.maxLength) {
        newErrors.validation = 'Minimum length cannot be greater than maximum length';
      }
      if (formData.validation.pattern) {
        try {
          new RegExp(formData.validation.pattern);
        } catch (e) {
          newErrors.validation = 'Invalid regular expression pattern';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Clean repeater fields data
      const cleanGroupFields = formData.groupFields.map((field) => {
        const cleanField = {
          id: field.id,
          label: field.label.trim(),
          type: field.type,
          required: field.required,
          width: field.width || '100'
        };

        // Add options array for choice-based fields
        if (['dropdown', 'multipleChoice'].includes(field.type)) {
          cleanField.options = (field.options || []).filter((opt) => opt.trim());
        }

        // Add enableRewrite for textarea fields
        if (field.type === 'textarea') {
          cleanField.enableRewrite = field.enableRewrite || false;
        }

        // Add phone number handling for phone type
        if (field.type === 'phone') {
          cleanField.example = field.example || { countryCode: '+1', number: '' };
        }

        return cleanField;
      });

      const cleanData = {
        id: formData.id,
        question: questionType === 'phone' ? '' : formData.question.trim(),
        type: questionType,
        required: formData.required,
        order: formData.order,
        width: formData.width,
        updatedAt: new Date().toISOString(),

        // Add inputType and enableRewrite for text questions
        ...(questionType === 'text' && {
          inputType: formData.inputType || 'text',
          enableRewrite: formData.inputType === 'textarea' ? formData.enableRewrite || false : false
        }),

        // Add options for choice-based questions
        ...(['multipleChoice', 'dropdown'].includes(questionType) && {
          options: formData.options.filter((opt) => opt.trim())
        }),

        // Add validation for text inputs
        ...(['text', 'textarea'].includes(questionType) && {
          validation: {
            minLength: parseInt(formData.validation.minLength) || 0,
            maxLength: parseInt(formData.validation.maxLength) || 1000,
            pattern: formData.validation.pattern
          }
        }),

        // Add phone number specific data
        ...(questionType === 'phone' && {
          example: formData.example || { countryCode: '+1', number: '' }
        }),

        // Add repeater fields configuration with options and validation
        ...(questionType === 'repeater' && {
          repeaterFields: cleanGroupFields,
          allowMultipleGroups: formData.allowMultipleGroups,
          validation: {
            minGroups: parseInt(formData.validation.minGroups) || 1,
            maxGroups: parseInt(formData.validation.maxGroups) || (formData.allowMultipleGroups ? 10 : 1)
          }
        })
      };

      // Debug log

      const success = await onSubmit(cleanData);

      if (success) {
        onCancel();
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
    if (errors.options) {
      setErrors({ ...errors, options: null });
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 1) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleAddGroupField = () => {
    setFormData({
      ...formData,
      groupFields: [
      ...formData.groupFields,
      {
        id: Date.now(),
        label: '',
        type: 'text',
        required: false,
        width: '100'
      }]

    });
  };

  const handleRemoveGroupField = (index) => {
    if (formData.groupFields.length > 1) {
      setFormData({
        ...formData,
        groupFields: formData.groupFields.filter((_, i) => i !== index)
      });
    }
  };

  const handleGroupFieldChange = (index, field, value) => {
    const newGroupFields = [...formData.groupFields];
    const currentField = { ...newGroupFields[index] }; // Create a deep copy of the current field

    if (field === 'type') {
      // If changing to a choice-based type
      if (['dropdown', 'multipleChoice'].includes(value)) {
        newGroupFields[index] = {
          ...currentField,
          type: value,
          options: currentField.options || [''] // Initialize options if not exists
        };
      } else if (value === 'textarea') {
        // If changing to textarea, initialize with enableRewrite field
        const { options, ...restField } = currentField;
        newGroupFields[index] = {
          ...restField,
          type: value,
          enableRewrite: false // Initialize enableRewrite as false
        };
      } else {
        // If changing from a choice-based type to another type
        const { options, enableRewrite, ...restField } = currentField;
        newGroupFields[index] = {
          ...restField,
          type: value
        };
      }
    } else if (field === 'enableRewrite') {
      // Special handling for enableRewrite checkbox
      newGroupFields[index] = {
        ...currentField,
        enableRewrite: value
      };
    } else {
      // For other field changes
      newGroupFields[index] = {
        ...currentField,
        [field]: value,
        // Preserve options array for choice-based fields
        ...(['dropdown', 'multipleChoice'].includes(currentField.type) && currentField.options && {
          options: currentField.options
        })
      };
    }

    setFormData({
      ...formData,
      groupFields: newGroupFields
    });

    // Debug log to check the state after update

  };

  const getPlaceholderExample = (index) => {
    const examples = [
    'e.g., School Name',
    'e.g., Degree/Qualification',
    'e.g., Field of Study',
    'e.g., Start Date',
    'e.g., End Date',
    'e.g., Grade/Score',
    'e.g., Description',
    'e.g., Location',
    'e.g., Achievement',
    'e.g., Additional Details'];


    return examples[index % examples.length];
  };

  const renderValidationFields = () => {
    if (['text', 'textarea'].includes(questionType)) {
      return (/*#__PURE__*/
        React.createElement("div", { className: "validation-fields" }, /*#__PURE__*/
        React.createElement("h4", { className: "validation-title" }, "Validation Rules"), /*#__PURE__*/
        React.createElement("div", { className: "validation-grid" }, /*#__PURE__*/
        React.createElement("div", { className: "validation-row" }, /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", { className: "form-label" }, "Minimum Length"), /*#__PURE__*/
        React.createElement("input", {
          type: "number",
          min: "0",
          value: formData.validation.minLength,
          onChange: (e) => setFormData({
            ...formData,
            validation: {
              ...formData.validation,
              minLength: parseInt(e.target.value) || 0
            }
          }),
          className: `form-input ${errors.validation ? 'error' : ''}` }
        )
        ), /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", { className: "form-label" }, "Maximum Length"), /*#__PURE__*/
        React.createElement("input", {
          type: "number",
          min: "0",
          value: formData.validation.maxLength,
          onChange: (e) => setFormData({
            ...formData,
            validation: {
              ...formData.validation,
              maxLength: parseInt(e.target.value) || 0
            }
          }),
          className: `form-input ${errors.validation ? 'error' : ''}` }
        )
        )
        )
        ),
        errors.validation && /*#__PURE__*/
        React.createElement("p", { className: "error-message" }, errors.validation)

        ));

    }
    return null;
  };

  const renderGroupFields = () => {
    if (questionType === 'repeater') {
      return (/*#__PURE__*/
        React.createElement("div", { className: "group-fields-section" }, /*#__PURE__*/
        React.createElement("h3", { className: "section-title" }, "Group Fields"), /*#__PURE__*/
        React.createElement("p", { className: "helper-text mb-4" }, "Configure the fields that will be included in each group."

        ), /*#__PURE__*/

        React.createElement("div", { className: "group-settings mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200" }, /*#__PURE__*/
        React.createElement("h4", { className: "text-sm font-medium text-gray-700 mb-3" }, "Group Settings"), /*#__PURE__*/

        React.createElement("div", { className: "form-checkbox mb-4" }, /*#__PURE__*/
        React.createElement("input", {
          type: "checkbox",
          checked: formData.allowMultipleGroups,
          onChange: (e) => setFormData((prev) => ({
            ...prev,
            allowMultipleGroups: e.target.checked,
            validation: {
              ...prev.validation,
              maxGroups: e.target.checked ? 10 : 1,
              minGroups: 1
            }
          })) }
        ), /*#__PURE__*/
        React.createElement("span", null, "Allow multiple groups")
        ),

        formData.allowMultipleGroups && /*#__PURE__*/
        React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", { className: "text-sm" }, "Minimum Groups"), /*#__PURE__*/
        React.createElement("input", {
          type: "number",
          min: "1",
          max: formData.validation.maxGroups,
          value: formData.validation.minGroups,
          onChange: (e) => setFormData((prev) => ({
            ...prev,
            validation: {
              ...prev.validation,
              minGroups: parseInt(e.target.value) || 1
            }
          })),
          className: "form-input" }
        )
        ), /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", { className: "text-sm" }, "Maximum Groups"), /*#__PURE__*/
        React.createElement("input", {
          type: "number",
          min: formData.validation.minGroups,
          value: formData.validation.maxGroups,
          onChange: (e) => setFormData((prev) => ({
            ...prev,
            validation: {
              ...prev.validation,
              maxGroups: parseInt(e.target.value) || 10
            }
          })),
          className: "form-input" }
        )
        )
        )

        ), /*#__PURE__*/

        React.createElement("div", { className: "group-fields space-y-4" },
        formData.groupFields.map((field, index) => /*#__PURE__*/
        React.createElement("div", { key: field.id, className: "group-field-item" }, /*#__PURE__*/
        React.createElement("div", { className: "field-header" }, /*#__PURE__*/
        React.createElement("div", { className: "drag-handle" }, /*#__PURE__*/
        React.createElement(FiMove, { className: "text-gray-400" })
        ), /*#__PURE__*/
        React.createElement("div", { className: "field-content" }, /*#__PURE__*/
        React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", null, "Field Label"), /*#__PURE__*/
        React.createElement("input", {
          type: "text",
          value: field.label,
          onChange: (e) => handleGroupFieldChange(index, 'label', e.target.value),
          placeholder: getPlaceholderExample(index),
          className: "form-input" }
        )
        ), /*#__PURE__*/
        React.createElement("div", { className: "form-group" }, /*#__PURE__*/
        React.createElement("label", null, "Field Type"), /*#__PURE__*/
        React.createElement("select", {
          value: field.type,
          onChange: (e) => handleGroupFieldChange(index, 'type', e.target.value),
          className: "form-input" }, /*#__PURE__*/

        React.createElement("option", { value: "text" }, "Single Line Text"), /*#__PURE__*/
        React.createElement("option", { value: "textarea" }, "Multi-line Text"), /*#__PURE__*/
        React.createElement("option", { value: "date" }, "Date"), /*#__PURE__*/
        React.createElement("option", { value: "dropdown" }, "Dropdown"), /*#__PURE__*/
        React.createElement("option", { value: "multipleChoice" }, "Multiple Choice"), /*#__PURE__*/
        React.createElement("option", { value: "file" }, "File Upload"), /*#__PURE__*/
        React.createElement("option", { value: "phone" }, "Phone Number")
        )
        )
        ), /*#__PURE__*/

        React.createElement("div", { className: "field-width mt-4" }, /*#__PURE__*/
        React.createElement("label", { className: "text-sm font-medium text-gray-700 mb-2" }, "Field Width"), /*#__PURE__*/
        React.createElement("div", { className: "flex gap-4" }, /*#__PURE__*/
        React.createElement("label", { className: "flex items-center" }, /*#__PURE__*/
        React.createElement("input", {
          type: "radio",
          name: `width-${field.id}`,
          value: "50",
          checked: field.width === '50',
          onChange: (e) => handleGroupFieldChange(index, 'width', e.target.value),
          className: "mr-2" }
        ), /*#__PURE__*/
        React.createElement("span", { className: "text-sm text-gray-600" }, "Half Width (50%)")
        ), /*#__PURE__*/
        React.createElement("label", { className: "flex items-center" }, /*#__PURE__*/
        React.createElement("input", {
          type: "radio",
          name: `width-${field.id}`,
          value: "100",
          checked: field.width === '100',
          onChange: (e) => handleGroupFieldChange(index, 'width', e.target.value),
          className: "mr-2" }
        ), /*#__PURE__*/
        React.createElement("span", { className: "text-sm text-gray-600" }, "Full Width (100%)")
        )
        )
        ), /*#__PURE__*/

        React.createElement("div", { className: "field-options mt-4" }, /*#__PURE__*/
        React.createElement("label", { className: "form-checkbox" }, /*#__PURE__*/
        React.createElement("input", {
          type: "checkbox",
          checked: field.required,
          onChange: (e) => handleGroupFieldChange(index, 'required', e.target.checked) }
        ), /*#__PURE__*/
        React.createElement("span", null, "Required field")
        )
        ),

        ['dropdown', 'singleChoice', 'multipleChoice'].includes(field.type) && /*#__PURE__*/
        React.createElement("div", { className: "field-options mt-4" }, /*#__PURE__*/
        React.createElement("label", { className: "text-sm font-medium text-gray-700 mb-2" }, "Options"), /*#__PURE__*/
        React.createElement("div", { className: "space-y-2" },
        (field.options || ['']).map((option, optionIndex) => /*#__PURE__*/
        React.createElement("div", { key: optionIndex, className: "flex gap-2" }, /*#__PURE__*/
        React.createElement("input", {
          type: "text",
          value: option,
          onChange: (e) => handleGroupFieldOptionChange(index, optionIndex, e.target.value),
          placeholder: `Option ${optionIndex + 1}`,
          className: "form-input" }
        ), /*#__PURE__*/
        React.createElement("button", {
          type: "button",
          onClick: () => handleRemoveGroupFieldOption(index, optionIndex),
          className: "remove-option-btn",
          disabled: (field.options || []).length <= 1 },
        "\xD7"

        )
        )
        ), /*#__PURE__*/
        React.createElement(AdminButton, {
          type: "button",
          variant: "outline",
          onClick: () => handleAddGroupFieldOption(index),
          className: "add-option-btn" },
        "Add Option"

        )
        )
        ),


        field.type === 'textarea' && /*#__PURE__*/
        React.createElement("div", { className: "form-group mt-4" }, /*#__PURE__*/
        React.createElement("label", { className: "form-checkbox" }, /*#__PURE__*/
        React.createElement("input", {
          type: "checkbox",
          checked: field.enableRewrite || false,
          onChange: (e) => handleGroupFieldChange(index, 'enableRewrite', e.target.checked) }
        ), /*#__PURE__*/
        React.createElement("span", null, "Enable AI Rewrite Feature"), /*#__PURE__*/
        React.createElement("p", { className: "info-text" }, "Allows users to rewrite their text using AI assistance"

        )
        )
        )

        ), /*#__PURE__*/
        React.createElement("button", {
          type: "button",
          onClick: () => handleRemoveGroupField(index),
          className: "remove-field-btn",
          disabled: formData.groupFields.length <= 1 }, /*#__PURE__*/

        React.createElement(FiTrash2, { className: "text-gray-400 hover:text-red-500" })
        )
        )
        )
        )
        ), /*#__PURE__*/

        React.createElement(AdminButton, {
          type: "button",
          variant: "outline",
          onClick: handleAddGroupField,
          className: "mt-4" }, /*#__PURE__*/

        React.createElement(FiPlus, null), " Add Field"
        )
        ));

    }
    return null;
  };

  const renderTypeSpecificFields = () => {
    switch (questionType) {
      case 'text':
        return (/*#__PURE__*/
          React.createElement("div", { className: "text-options" }, /*#__PURE__*/
          React.createElement("div", { className: "form-group" }, /*#__PURE__*/
          React.createElement("label", { className: "form-label" }, "Input Type"), /*#__PURE__*/
          React.createElement("select", {
            value: formData.inputType || 'text',
            onChange: (e) => setFormData({
              ...formData,
              inputType: e.target.value,
              validation: {
                ...formData.validation,
                maxLength: e.target.value === 'textarea' ? 500 : 100
              }
            }),
            className: "form-input" }, /*#__PURE__*/

          React.createElement("option", { value: "text" }, "Single Line Text"), /*#__PURE__*/
          React.createElement("option", { value: "textarea" }, "Multi-line Text (Textarea)")
          )
          ),

          formData.inputType === 'textarea' && /*#__PURE__*/
          React.createElement("div", { className: "form-group mt-4" }, /*#__PURE__*/
          React.createElement("label", { className: "form-checkbox" }, /*#__PURE__*/
          React.createElement("input", {
            type: "checkbox",
            checked: formData.enableRewrite || false,
            onChange: (e) => setFormData({
              ...formData,
              enableRewrite: e.target.checked
            }) }
          ), /*#__PURE__*/
          React.createElement("span", null, "Enable AI Rewrite Feature"), /*#__PURE__*/
          React.createElement("p", { className: "info-text" }, "Allows users to rewrite their text using AI assistance"

          )
          )
          )

          ));


      case 'phone':
        return null;

      case 'multipleChoice':
      case 'dropdown':
        return (/*#__PURE__*/
          React.createElement("div", { className: "options-container" }, /*#__PURE__*/
          React.createElement("label", { className: "form-label required-field" }, "Options"),
          formData.options.map((option, index) => /*#__PURE__*/
          React.createElement("div", { key: index, className: "option-row" }, /*#__PURE__*/
          React.createElement("input", {
            type: "text",
            value: option,
            onChange: (e) => handleOptionChange(index, e.target.value),
            placeholder: `Option ${index + 1}`,
            className: `form-input ${errors.options ? 'error' : ''}` }
          ), /*#__PURE__*/
          React.createElement("button", {
            type: "button",
            onClick: () => removeOption(index),
            className: "remove-option-btn",
            disabled: formData.options.length <= 1 },
          "\xD7"

          )
          )
          ),
          errors.options && /*#__PURE__*/
          React.createElement("p", { className: "error-message" }, errors.options), /*#__PURE__*/

          React.createElement(AdminButton, {
            type: "button",
            variant: "outline",
            onClick: addOption,
            className: "add-option-btn" },
          "Add Option"

          )
          ));

    }
  };

  const renderWidthSelection = () => {
    return (/*#__PURE__*/
      React.createElement("div", { className: "field-width mt-4" }, /*#__PURE__*/
      React.createElement("label", { className: "text-sm font-medium text-gray-700 mb-2" }, "Field Width"), /*#__PURE__*/
      React.createElement("div", { className: "flex gap-4" }, /*#__PURE__*/
      React.createElement("label", { className: "flex items-center" }, /*#__PURE__*/
      React.createElement("input", {
        type: "radio",
        name: "field-width",
        value: "50",
        checked: formData.width === '50',
        onChange: (e) => setFormData({ ...formData, width: e.target.value }),
        className: "mr-2" }
      ), /*#__PURE__*/
      React.createElement("span", { className: "text-sm text-gray-600" }, "Half Width (50%)")
      ), /*#__PURE__*/
      React.createElement("label", { className: "flex items-center" }, /*#__PURE__*/
      React.createElement("input", {
        type: "radio",
        name: "field-width",
        value: "100",
        checked: formData.width === '100',
        onChange: (e) => setFormData({ ...formData, width: e.target.value }),
        className: "mr-2" }
      ), /*#__PURE__*/
      React.createElement("span", { className: "text-sm text-gray-600" }, "Full Width (100%)")
      )
      )
      ));

  };

  const handleGroupFieldOptionChange = (fieldIndex, optionIndex, value) => {
    const newGroupFields = [...formData.groupFields];
    if (!newGroupFields[fieldIndex].options) {
      newGroupFields[fieldIndex].options = [''];
    }
    newGroupFields[fieldIndex].options[optionIndex] = value;
    setFormData({
      ...formData,
      groupFields: newGroupFields
    });
  };

  const handleAddGroupFieldOption = (fieldIndex) => {
    const newGroupFields = [...formData.groupFields];
    if (!newGroupFields[fieldIndex].options) {
      newGroupFields[fieldIndex].options = [''];
    } else {
      newGroupFields[fieldIndex].options.push('');
    }
    setFormData({
      ...formData,
      groupFields: newGroupFields
    });
  };

  const handleRemoveGroupFieldOption = (fieldIndex, optionIndex) => {
    const newGroupFields = [...formData.groupFields];
    if (newGroupFields[fieldIndex].options.length > 1) {
      newGroupFields[fieldIndex].options = newGroupFields[fieldIndex].options.filter(
        (_, i) => i !== optionIndex
      );
      setFormData({
        ...formData,
        groupFields: newGroupFields
      });
    }
  };

  return (/*#__PURE__*/
    React.createElement("form", { onSubmit: handleSubmit, className: "question-form" },
    questionType !== 'phone' && /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { className: "form-label required-field" }, "Question Text"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      value: formData.question,
      onChange: (e) => {
        setFormData({ ...formData, question: e.target.value });
        if (errors.question) setErrors({ ...errors, question: null });
      },
      placeholder: "Enter your question",
      className: `form-input ${errors.question ? 'error' : ''}` }
    ),
    errors.question && /*#__PURE__*/
    React.createElement("p", { className: "error-message" }, errors.question)

    ),


    questionType !== 'repeater' && renderWidthSelection(),

    renderTypeSpecificFields(),
    renderValidationFields(), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { className: "form-checkbox" }, /*#__PURE__*/
    React.createElement("input", {
      type: "checkbox",
      checked: formData.required,
      onChange: (e) => setFormData({ ...formData, required: e.target.checked }) }
    ), /*#__PURE__*/
    React.createElement("span", null, "Required field")
    )
    ),

    renderGroupFields(),

    errors.submit && /*#__PURE__*/
    React.createElement("div", { className: "error-message submit-error" },
    errors.submit
    ), /*#__PURE__*/


    React.createElement("div", { className: "form-actions" }, /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "outline",
      onClick: onCancel,
      disabled: isSubmitting },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      type: "submit",
      variant: "primary",
      isLoading: isSubmitting,
      disabled: isSubmitting },

    initialData ? 'Save Changes' : 'Add Question'
    )
    ), /*#__PURE__*/

    React.createElement("input", { type: "hidden", name: "profileType", value: profileType }), /*#__PURE__*/
    React.createElement("input", { type: "hidden", name: "sectionId", value: sectionId })
    ));

};

export default QuestionForm;