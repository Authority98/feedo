import { useCallback } from 'react';

export const useFormHandlers = ({ setFormData, queueChange }) => {
  const handleInputChange = useCallback((questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    queueChange(questionId, value);
  }, [queueChange]);

  const handleMultiSelectChange = useCallback((questionId, event) => {
    const value = typeof event.target.value === 'string' ? 
      event.target.value.split(',') : 
      event.target.value;

    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    queueChange(questionId, value);
  }, [queueChange]);

  const handleGroupFieldChange = useCallback((questionId, groupIndex, fieldId, value) => {
    setFormData(prev => {
      const groups = [...(prev[questionId] || [])];
      if (!groups[groupIndex]) {
        groups[groupIndex] = {};
      }
      groups[groupIndex] = {
        ...groups[groupIndex],
        [fieldId]: value
      };
      const newData = {
        ...prev,
        [questionId]: groups
      };
      queueChange(questionId, groups);
      return newData;
    });
  }, [queueChange]);

  const handleAddGroup = useCallback((questionId, fields) => {
    setFormData(prev => {
      const groups = [...(prev[questionId] || [])];
      const newGroup = Object.fromEntries(
        fields.map(field => [
          field.id,
          field.type === 'multipleChoice' ? [] : ''
        ])
      );
      const newGroups = [...groups, newGroup];
      queueChange(questionId, newGroups);
      return {
        ...prev,
        [questionId]: newGroups
      };
    });
  }, [queueChange]);

  const handleRemoveGroup = useCallback((questionId, groupIndex) => {
    setFormData(prev => {
      const groups = [...(prev[questionId] || [])];
      groups.splice(groupIndex, 1);
      queueChange(questionId, groups);
      return {
        ...prev,
        [questionId]: groups
      };
    });
  }, [queueChange]);

  return {
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup
  };
}; 