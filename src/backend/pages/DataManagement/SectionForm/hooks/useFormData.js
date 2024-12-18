import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../auth/AuthContext';
import { useToast } from '../../../../../components/Toast/ToastContext';

import { useAutoSave } from './formData/useAutoSave';
import { useFormHandlers } from './formData/useFormHandlers';
import { useFileHandling } from './formData/useFileHandling';
import { useRewrite } from './formData/useRewrite';
import { useSectionData } from './formData/useSectionData';
import { useCleanup } from './formData/useCleanup';

export const useFormData = (section, profileType) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  
  // Form-related states
  const [formData, setFormData] = useState({});
  const [fileUploading, setFileUploading] = useState({});
  const [enhancingFields, setEnhancingFields] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch section data
  const {
    sectionData,
    loading: sectionLoading,
    error: sectionError
  } = useSectionData(user, section);

  // Update form data when section data changes
  useEffect(() => {
    if (sectionData) {
      setFormData(sectionData);
    }
  }, [sectionData]);

  // Initialize auto-save functionality
  const {
    queueChange,
    saveTimeoutRef
  } = useAutoSave({
    section,
    profileType,
    formData,
    updateProfile,
    showToast
  });

  // Initialize form handlers
  const {
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup
  } = useFormHandlers({
    setFormData,
    queueChange
  });

  // Initialize file handling
  const handleFileChange = useFileHandling({
    user,
    section,
    setFormData,
    setFileUploading,
    setFilePreviews,
    queueChange,
    showToast
  });

  // Initialize rewrite functionality
  const handleRewrite = useRewrite({
    formData,
    section,
    user,
    setFormData,
    setEnhancingFields,
    queueChange,
    showToast
  });

  // Handle cleanup
  useCleanup({ saveTimeoutRef, filePreviews });

  return {
    formData,
    fileUploading,
    enhancingFields,
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup,
    handleFileChange,
    handleRewrite,
    filePreviews,
    errors,
    setErrors,
    loading: sectionLoading,
    error: sectionError
  };
};

export default useFormData;