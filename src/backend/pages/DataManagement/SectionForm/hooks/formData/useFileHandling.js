import { useCallback } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../../../../../firebase/config';
import { uploadFile } from './utils';
import { mapFileDataToFormData } from './mappers';
import { FILE_CONSTANTS, ERROR_MESSAGES } from './constants';
import { eventEmitter, EVENTS } from '../../../../../../services/eventEmitter';
import { mapFormDataToProfileSection } from './mappers';

export const useFileHandling = ({
  user,
  section,
  formData,
  setFormData,
  setFileUploading,
  setFilePreviews,
  queueChange,
  showToast,
  updateProfile
}) => {
  const updateFormData = useCallback((questionId, groupIndex, fieldId, fileData) => {
    setFormData(prev => {
      let newData = { ...prev };

      if (groupIndex !== undefined && fieldId !== undefined) {
        // Handle group files
        const groups = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
        
        if (fileData === null) {
          // Remove file from group
          if (groups[groupIndex]) {
            const { [fieldId]: _, ...rest } = groups[groupIndex];
            groups[groupIndex] = rest;
          }
        } else {
          // Add/update file in group
          if (!groups[groupIndex]) groups[groupIndex] = {};
          groups[groupIndex] = { ...groups[groupIndex], [fieldId]: fileData };
        }
        
        newData[questionId] = groups;
      } else {
        // Handle non-group files
        if (fileData === null) {
          delete newData[questionId];
        } else {
          newData[questionId] = fileData;
        }
      }

      queueChange(questionId, newData[questionId]);
      return newData;
    });
  }, [setFormData, queueChange]);

  const cleanupFilePreview = useCallback((previewKey) => {
    setFilePreviews(prev => {
      const oldPreview = prev[previewKey];
      if (oldPreview && typeof oldPreview === 'string' && oldPreview.startsWith('blob:')) {
        URL.revokeObjectURL(oldPreview);
      }
      const { [previewKey]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const deleteFileFromStorage = useCallback(async (fileUrl) => {
    if (!fileUrl || typeof fileUrl !== 'string') return true;

    try {
      const urlParts = fileUrl.split('/o/');
      if (urlParts.length !== 2) return true;

      const encodedPath = urlParts[1].split('?')[0];
      const storagePath = decodeURIComponent(encodedPath);
      const storageRef = ref(storage, storagePath);
      
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      if (error.code === 'storage/object-not-found') return true;
      throw error;
    }
  }, []);

  const handleFileRemoval = useCallback(async (questionId, groupIndex, fieldId, previewKey, currentFileData) => {
    try {
      // Set loading state
      setFileUploading(prev => ({ ...prev, [previewKey]: true }));

      // 1. Clean up preview first (immediate UI feedback)
      cleanupFilePreview(previewKey);

      // 2. Remove from form data
      setFormData(prev => {
        let newData = { ...prev };

        if (groupIndex !== undefined && fieldId !== undefined) {
          const groups = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
          if (groups[groupIndex]) {
            const { [fieldId]: _, ...rest } = groups[groupIndex];
            groups[groupIndex] = rest;
          }
          newData[questionId] = groups;
        } else {
          delete newData[questionId];
        }

        // 3. Save changes to Firebase immediately
        const profileSection = mapFormDataToProfileSection(newData, section, user?.profile?.userType);
        if (profileSection) {
          updateProfile({
            profileSections: {
              [section.id]: profileSection
            }
          }).then(() => {
            // 4. Emit update event after successful save
            eventEmitter.emit(EVENTS.SECTION_DATA_UPDATED, { silent: true });
          });
        }

        return newData;
      });

      // 5. Delete from storage (if exists)
      if (currentFileData?.url) {
        await deleteFileFromStorage(currentFileData.url).catch(error => {
          console.error('Failed to delete from storage:', error);
          // Continue anyway as UI is already updated
        });
      }

      showToast('File removed successfully', 'success');
      return true;
    } catch (error) {
      console.error('Failed to remove file:', error);
      showToast('Failed to remove file. Please try again.', 'error');
      return false;
    } finally {
      // Clean up loading state
      setFileUploading(prev => {
        const { [previewKey]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [deleteFileFromStorage, updateFormData, cleanupFilePreview, showToast, setFileUploading, section, user?.profile?.userType, updateProfile]);

  const validateFile = useCallback((file, question) => {
    if (!file) return { valid: false, error: 'No file provided' };

    const allowedTypes = question?.validation?.fileTypes || ['image/*'];
    const maxSize = question?.validation?.maxSize || FILE_CONSTANTS.MAX_SIZE_BYTES;

    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit` 
      };
    }

    return { valid: true };
  }, []);

  return useCallback(async (questionId, file, groupIndex, fieldId) => {
    if (!user?.profile?.authUid) {
      showToast(ERROR_MESSAGES.LOGIN_REQUIRED.FILE_UPLOAD, 'error');
      return;
    }

    if (!questionId) {
      console.error('Question ID is required for file handling');
      return;
    }

    const question = section.questions?.find(q => q.id === questionId);
    if (!question) {
      console.error('Question configuration not found');
      return;
    }

    const previewKey = groupIndex !== undefined && fieldId !== undefined
      ? [questionId, groupIndex, fieldId].join(FILE_CONSTANTS.PREVIEW_KEY_SEPARATOR)
      : questionId;

    try {
      // Set loading state
      setFileUploading(prev => ({ ...prev, [previewKey]: true }));

      // Get current file data
      const currentFileData = groupIndex !== undefined && fieldId !== undefined
        ? formData[questionId]?.[groupIndex]?.[fieldId]
        : formData[questionId];

      // Handle file deletion
      if (!file) {
        return await handleFileRemoval(questionId, groupIndex, fieldId, previewKey, currentFileData);
      }

      // Validate new file
      const validation = validateFile(file, question);
      if (!validation.valid) {
        showToast(validation.error, 'error');
        return;
      }

      // Create upload path
      const uploadPathParts = [
        'users',
        user.profile.authUid,
        section.id,
        questionId
      ];

      if (groupIndex !== undefined && fieldId !== undefined) {
        uploadPathParts.push(groupIndex, fieldId);
      }

      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      uploadPathParts.push(`${timestamp}-${sanitizedFileName}`);
      const uploadPath = uploadPathParts.join(FILE_CONSTANTS.UPLOAD_PATH_SEPARATOR);

      // Set preview for immediate feedback
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews(prev => ({ ...prev, [previewKey]: previewUrl }));

      try {
        // Upload new file
        const downloadURL = await uploadFile(file, uploadPath);
        const fileData = mapFileDataToFormData(file, downloadURL);
        
        // Update form data with new file
        updateFormData(questionId, groupIndex, fieldId, fileData);

        // Clean up old file if exists
        if (currentFileData?.url) {
          await deleteFileFromStorage(currentFileData.url).catch(error => {
            console.error('Failed to delete old file:', error);
            // Continue as new file is already uploaded
          });
        }

        showToast(ERROR_MESSAGES.FILE.UPLOAD_SUCCESS, 'success');
      } catch (error) {
        // Clean up preview on error
        cleanupFilePreview(previewKey);
        throw error;
      }
    } catch (error) {
      console.error('Error handling file:', error);
      showToast(ERROR_MESSAGES.FILE.UPLOAD_FAILED, 'error');
    } finally {
      // Clean up loading state
      setFileUploading(prev => {
        const { [previewKey]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [
    user?.profile?.authUid,
    section.id,
    section.questions,
    formData,
    updateFormData,
    setFileUploading,
    setFilePreviews,
    showToast,
    deleteFileFromStorage,
    handleFileRemoval,
    cleanupFilePreview,
    validateFile
  ]);
}; 