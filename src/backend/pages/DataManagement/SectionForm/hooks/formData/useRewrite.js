import { useCallback } from 'react';
import { generateProfessionalSummary } from '../../../../../../services/openai';
import { eventEmitter, EVENTS } from '../../../../../../services/eventEmitter';
import { FIELD_CONSTANTS, ERROR_MESSAGES } from './constants';

export const useRewrite = ({
  formData,
  section,
  user,
  setFormData,
  setEnhancingFields,
  queueChange,
  showToast
}) => {
  return useCallback(async (questionId, groupIndex, fieldId) => {
    if (!user?.profile?.authUid) {
      showToast(ERROR_MESSAGES.LOGIN_REQUIRED.REWRITE, 'error');
      return;
    }

    try {
      setEnhancingFields(prev => ({
        ...prev,
        [questionId]: true
      }));

      const currentText = groupIndex !== undefined && fieldId !== undefined
        ? formData[questionId]?.[groupIndex]?.[fieldId]
        : formData[questionId];

      if (!currentText) {
        showToast(ERROR_MESSAGES.REWRITE.NO_TEXT, 'error');
        return;
      }

      const question = section.questions.find(q => q.id === questionId);
      if (!question) {
        showToast(ERROR_MESSAGES.REWRITE.NO_CONFIG, 'error');
        return;
      }

      const maxLength = question?.validation?.maxLength || FIELD_CONSTANTS.DEFAULT_MAX_LENGTH;
      const enhancedText = await generateProfessionalSummary(currentText, maxLength, user.profile.authUid);

      if (!enhancedText) {
        showToast(ERROR_MESSAGES.REWRITE.ENHANCE_FAILED, 'error');
        return;
      }

      updateFormData(questionId, groupIndex, fieldId, enhancedText);
      showToast(ERROR_MESSAGES.REWRITE.ENHANCE_SUCCESS, 'success');
      eventEmitter.emit(EVENTS.TOKEN_USAGE_UPDATED);
    } catch (error) {
      console.error('Error in handleRewrite:', error);
      showToast(
        error.message || ERROR_MESSAGES.REWRITE.ENHANCE_FAILED,
        error.message?.includes('token') ? 'warning' : 'error'
      );
    } finally {
      setEnhancingFields(prev => ({
        ...prev,
        [questionId]: false
      }));
    }
  }, [formData, section.questions, user?.profile?.authUid, queueChange, showToast]);

  const updateFormData = (questionId, groupIndex, fieldId, enhancedText) => {
    if (groupIndex !== undefined && fieldId !== undefined) {
      setFormData(prev => {
        const groups = [...(prev[questionId] || [])];
        if (!groups[groupIndex]) {
          groups[groupIndex] = {};
        }
        groups[groupIndex] = {
          ...groups[groupIndex],
          [fieldId]: enhancedText
        };
        queueChange(questionId, groups);
        return {
          ...prev,
          [questionId]: groups
        };
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [questionId]: enhancedText
        };
        queueChange(questionId, enhancedText);
        return newData;
      });
    }
  };
}; 