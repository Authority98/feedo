import React from 'react';
import EnhanceWithAI from '../../../../../components/EnhanceWithAI/EnhanceWithAI';
import PhoneNumberInput from '../../../../../components/PhoneNumberInput/PhoneNumberInput';

const renderField = (question, value, handleChange, handleRewrite, enhancingFields) => {
  switch (question.type) {
    case 'text':
      if (question.inputType === 'textarea') {
        return (
          <div className="textarea-field">
            <textarea
              value={value || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={`Enter your ${question.question.toLowerCase()}`}
              className="form-input"
              required={question.required}
            />
            {question.enableRewrite && (
              <EnhanceWithAI
                text={value || ''}
                onRewrite={(enhancedText) => handleRewrite(question.id, enhancedText)}
                isLoading={enhancingFields[question.id]}
              />
            )}
          </div>
        );
      }
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          placeholder={`Enter your ${question.question.toLowerCase()}`}
          className="form-input"
          required={question.required}
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
        <input
          type="date"
          value={value || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          className="form-input"
          required={question.required}
        />
      );

    case 'multipleChoice':
      return (
        <div className="checkbox-group">
          {question.options.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
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
              {option}
            </label>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          className="form-input"
          required={question.required}
        >
          <option value="">Select an option</option>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'file':
      return (
        <div className="file-upload-field">
          <input
            type="file"
            onChange={(e) => handleChange(question.id, e.target.files[0])}
            className="form-input"
            required={question.required && !value}
          />
          {value && value.url && (
            <div className="file-preview">
              <a href={value.url} target="_blank" rel="noopener noreferrer">
                {value.name}
              </a>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

const renderGroupField = (field, value, onChange, groupIndex, handleRewrite, enhancingFields) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(groupIndex, field.id, e.target.value)}
          placeholder={field.label}
          className="form-input"
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <div className="textarea-field">
          <textarea
            value={value || ''}
            onChange={(e) => onChange(groupIndex, field.id, e.target.value)}
            placeholder={field.label}
            className="form-input"
            required={field.required}
          />
          {field.enableRewrite && (
            <EnhanceWithAI
              text={value || ''}
              onRewrite={(enhancedText) => handleRewrite(null, enhancedText, groupIndex, field.id)}
              isLoading={enhancingFields[`${groupIndex}-${field.id}`]}
            />
          )}
        </div>
      );

    case 'phone':
      return (
        <PhoneNumberInput
          value={value || { countryCode: '+1', country: 'United States', number: '' }}
          onChange={(newValue) => onChange(groupIndex, field.id, newValue)}
          required={field.required}
          placeholder={field.example || { countryCode: '+1', country: 'United States', number: '' }}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(groupIndex, field.id, e.target.value)}
          className="form-input"
          required={field.required}
        />
      );

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(groupIndex, field.id, e.target.value)}
          className="form-input"
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'multipleChoice':
      return (
        <div className="checkbox-group">
          {field.options.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
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
                  onChange(groupIndex, field.id, newValue);
                }}
                required={field.required && (!value || value.length === 0)}
              />
              {option}
            </label>
          ))}
        </div>
      );

    case 'file':
      return (
        <div className="file-upload-field">
          <input
            type="file"
            onChange={(e) => onChange(groupIndex, field.id, e.target.files[0])}
            className="form-input"
            required={field.required && !value}
          />
          {value && value.url && (
            <div className="file-preview">
              <a href={value.url} target="_blank" rel="noopener noreferrer">
                {value.name}
              </a>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export { renderField, renderGroupField }; 