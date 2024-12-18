import { useCallback } from 'react';
import { uploadFile } from './utils';
import { mapFileDataToFormData } from './mappers';
import { FILE_CONSTANTS, ERROR_MESSAGES, FIELD_CONSTANTS } from './constants';

export const useFileHandling = ({
  user,
  section,
  setFormData,
  setFileUploading,
  setFilePreviews,
  queueChange,
  showToast
}) => {
  return useCallback(async (questionId, file, groupIndex, fieldId) => {
    if (!user?.profile?.authUid) {
      showToast(ERROR_MESSAGES.LOGIN_REQUIRED.FILE_UPLOAD, 'error');
      return;
    }

    // Generate unique key for tracking file upload state and preview
    const previewKey = groupIndex !== undefined && fieldId !== undefined ?
      [questionId, groupIndex, fieldId].join(FILE_CONSTANTS.PREVIEW_KEY_SEPARATOR) :
      questionId;

    try {
      setFileUploading(prev => ({
        ...prev,
        [previewKey]: true
      }));

      if (!file) {
        await handleFileRemoval(questionId, groupIndex, fieldId);
        return;
      }

      if (file.size > FILE_CONSTANTS.MAX_SIZE_BYTES) {
        showToast(ERROR_MESSAGES.FILE.SIZE_LIMIT, 'error');
        return;
      }

      // Construct upload path with timestamp to prevent name collisions
      const uploadPathParts = [
        'users',
        user.profile.authUid,
        section.id,
        questionId
      ];

      if (groupIndex !== undefined && fieldId !== undefined) {
        uploadPathParts.push(groupIndex, fieldId);
      }

      uploadPathParts.push(`${Date.now()}-${file.name}`);
      const uploadPath = uploadPathParts.join(FILE_CONSTANTS.UPLOAD_PATH_SEPARATOR);

      // Generate and set preview before upload starts
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews(prev => ({
        ...prev,
        [previewKey]: previewUrl
      }));

      try {
        const downloadURL = await uploadFile(file, uploadPath);
        const fileData = mapFileDataToFormData(file, downloadURL);

        updateFormData(questionId, groupIndex, fieldId, fileData);
        showToast(ERROR_MESSAGES.FILE.UPLOAD_SUCCESS, 'success');
      } catch (uploadError) {
        cleanupFailedUpload(previewKey);
        throw uploadError;
      }
    } catch (error) {
      console.error('Error handling file:', error);
      showToast(
        error.message === ERROR_MESSAGES.FILE.SIZE_LIMIT
          ? error.message
          : ERROR_MESSAGES.FILE.UPLOAD_FAILED,
        'error'
      );
    } finally {
      setFileUploading(prev => ({
        ...prev,
        [previewKey]: false
      }));
    }
  }, [user?.profile?.authUid, section.id, queueChange, showToast]);

  // Helper functions
  const handleFileRemoval = async (questionId, groupIndex, fieldId) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (groupIndex !== undefined && fieldId !== undefined) {
        if (!newData[questionId]) newData[questionId] = [];
        if (!newData[questionId][groupIndex]) newData[questionId][groupIndex] = {};
        newData[questionId][groupIndex][fieldId] = FIELD_CONSTANTS.DEFAULT_FILE_VALUE;
      } else {
        newData[questionId] = FIELD_CONSTANTS.DEFAULT_FILE_VALUE;
      }
      queueChange(questionId, newData[questionId]);
      return newData;
    });

    setFilePreviews(prev => ({
      ...prev,
      [previewKey]: FIELD_CONSTANTS.DEFAULT_FILE_VALUE
    }));
  };

  const updateFormData = (questionId, groupIndex, fieldId, fileData) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (groupIndex !== undefined && fieldId !== undefined) {
        if (!newData[questionId]) newData[questionId] = [];
        if (!newData[questionId][groupIndex]) newData[questionId][groupIndex] = {};
        newData[questionId][groupIndex][fieldId] = fileData;
      } else {
        newData[questionId] = fileData;
      }
      queueChange(questionId, newData[questionId]);
      return newData;
    });
  };

  const cleanupFailedUpload = (previewKey) => {
    setFilePreviews(prev => ({
      ...prev,
      [previewKey]: FIELD_CONSTANTS.DEFAULT_FILE_VALUE
    }));
  };
}; 