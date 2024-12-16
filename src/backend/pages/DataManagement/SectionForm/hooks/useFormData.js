import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../../auth/AuthContext';
import { eventEmitter, EVENTS } from '../../../../../services/eventEmitter';
import { useToast } from '../../../../../components/Toast/ToastContext';
import { storage, auth } from '../../../../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateProfessionalSummary } from '../../../../../services/openai';
import { updateEmail, verifyBeforeUpdateEmail, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';

export const useFormData = (section, profileType, initialFormData) => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialFormData || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState({});
  const [enhancingFields, setEnhancingFields] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [lastEnhancedField, setLastEnhancedField] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Add auth state change listener for email updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser && user?.profile?.authUid) {
        // Check if email has changed
        if (authUser.email !== user.profile.email) {
          try {
            // Update email in Firestore
            const userRef = doc(db, 'users', user.profile.authUid);
            await updateDoc(userRef, {
              'profile.email': authUser.email,
              'email': authUser.email
            });

            // Update profile in context
            await updateProfile({
              profile: {
                ...user.profile,
                email: authUser.email
              }
            });

            // Refresh user data
            await refreshUser();

            showToast('Email updated successfully!', 'success');
          } catch (error) {
            console.error('Error updating email in profile:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user?.profile?.authUid]);

  // Monitor form data changes
  useEffect(() => {
    if (lastEnhancedField) {
      const { questionId, groupIndex, fieldId, enhancedText } = lastEnhancedField;
      
      // Verify the update was successful
      let currentValue;
      if (groupIndex !== undefined && fieldId !== undefined) {
        currentValue = formData[questionId]?.[groupIndex]?.[fieldId];
      } else {
        currentValue = formData[questionId];
      }

      console.log('Form data update verification:', {
        expected: enhancedText,
        actual: currentValue,
        match: currentValue === enhancedText
      });

      // Clear the last enhanced field
      setLastEnhancedField(null);
    }
  }, [formData, lastEnhancedField]);

  // Function to upload file to Firebase Storage
  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Update formData when initialFormData changes
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0 && !formData.hasBeenInitialized) {
      console.log('Setting form data from initialFormData:', initialFormData);
      setFormData({
        ...initialFormData,
        hasBeenInitialized: true
      });
    }
  }, [initialFormData, formData.hasBeenInitialized]);

  // Load existing data for this section
  useEffect(() => {
    if (!user || !section?.questions) return;
    
    // Skip initialization if we already have form data
    if (Object.keys(formData).length > 0) return;
    
    try {
      setLoading(true);
      console.log('Loading data for section:', section.id);
      console.log('User data:', user);
      console.log('Initial form data:', initialFormData);
      
      // Initialize empty data structure
      const initialData = {};
      
      // Initialize all questions with default values first
      section.questions.forEach(question => {
        if (!question || !question.id) {
          console.log('Invalid question found:', question);
          return;
        }

        try {
          if (question.type === 'repeater') {
            // Ensure repeater fields are always initialized as arrays
            const existingData = initialFormData?.[question.id];
            if (Array.isArray(existingData) && existingData.length > 0) {
              // Ensure each group has all required fields
              initialData[question.id] = existingData.map(group => ({
                ...Object.fromEntries(
                  (question.repeaterFields || []).map(field => {
                    if (['singleChoice', 'multipleChoice', 'dropdown'].includes(field.type)) {
                      return [field.id, field.type === 'multipleChoice' ? [] : ''];
                    }
                    return [field.id, field.type === 'file' ? null : ''];
                  })
                ),
                ...group // Merge with existing data
              }));
            } else {
              initialData[question.id] = [{
                ...Object.fromEntries(
                  (question.repeaterFields || []).map(field => {
                    if (['singleChoice', 'multipleChoice', 'dropdown'].includes(field.type)) {
                      return [field.id, field.type === 'multipleChoice' ? [] : ''];
                    }
                    return [field.id, field.type === 'file' ? null : ''];
                  })
                )
              }];
            }
          } else if (question.type === 'multipleChoice') {
            initialData[question.id] = Array.isArray(initialFormData?.[question.id]) ? initialFormData[question.id] : [];
          } else if (question.type === 'file') {
            initialData[question.id] = initialFormData?.[question.id] || null;
          } else {
            initialData[question.id] = initialFormData?.[question.id] || '';
          }
        } catch (error) {
          console.error('Error initializing question:', question.id, error);
          // Initialize with a safe default value based on question type
          initialData[question.id] = question.type === 'multipleChoice' ? [] : '';
        }
      });

      // No need to merge with initialFormData again since we've already used it above
      console.log('Final merged form data:', initialData);
      setFormData(initialData);
    } catch (error) {
      console.error('Error loading form data:', error);
      setErrors({ submit: 'Error loading form data' });
    } finally {
      setLoading(false);
    }
  }, [user, section?.id, section?.questions, formData]);

  // Helper function to clean undefined values
  const cleanUndefinedValues = (obj) => {
    const cleaned = {};
    
    for (const key in obj) {
      if (obj[key] === undefined) {
        continue; // Skip undefined values
      }
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        cleaned[key] = cleanUndefinedValues(obj[key]); // Recursively clean nested objects
      } else {
        cleaned[key] = obj[key]; // Keep non-undefined values
      }
    }
    
    return cleaned;
  };

  // Debounced auto-save function
  const debouncedSave = useCallback(async (data) => {
    try {
      setAutoSaving(true);
      await updateUserData(section.id, data);
      eventEmitter.emit(EVENTS.SECTION_DATA_UPDATED);
    } catch (error) {
      console.error('Auto-save failed:', error);
      showToast('Auto-save failed. Your changes will be saved when you click Save.', 'error');
    } finally {
      setAutoSaving(false);
    }
  }, [section.id]);

  // Function to trigger auto-save with debounce
  const triggerAutoSave = useCallback((newData) => {
    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      debouncedSave(newData);
    }, 1000); // 1 second delay

    setSaveTimeout(timeoutId);
  }, [saveTimeout, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // Update handleInputChange
  const handleInputChange = (questionId, value) => {
    const newFormData = {
      ...formData,
      [questionId]: value
    };
    setFormData(newFormData);
    triggerAutoSave(newFormData);
  };

  // Update handleMultiSelectChange
  const handleMultiSelectChange = (questionId, event) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    
    const newFormData = {
      ...formData,
      [questionId]: selectedValues
    };
    setFormData(newFormData);
    triggerAutoSave(newFormData);
  };

  // Update handleGroupFieldChange
  const handleGroupFieldChange = (questionId, groupIndex, fieldId, value) => {
    const newFormData = { ...formData };
    const currentGroups = Array.isArray(newFormData[questionId]) ? [...newFormData[questionId]] : [];
    
    if (!currentGroups[groupIndex]) {
      currentGroups[groupIndex] = {};
    }
    
    currentGroups[groupIndex] = {
      ...currentGroups[groupIndex],
      [fieldId]: value
    };
    
    newFormData[questionId] = currentGroups;
    setFormData(newFormData);
    triggerAutoSave(newFormData);
  };

  // Update handleAddGroup
  const handleAddGroup = (questionId, fields) => {
    const newFormData = { ...formData };
    const currentGroups = Array.isArray(newFormData[questionId]) ? newFormData[questionId] : [];
    const newGroup = {};
    
    fields.forEach(field => {
      if (['singleChoice', 'multipleChoice', 'dropdown'].includes(field.type)) {
        newGroup[field.id] = field.type === 'multipleChoice' ? [] : '';
      } else {
        newGroup[field.id] = '';
      }
    });

    newFormData[questionId] = [...currentGroups, newGroup];
    setFormData(newFormData);
    triggerAutoSave(newFormData);
  };

  // Update handleRemoveGroup
  const handleRemoveGroup = (questionId, groupIndex) => {
    const newFormData = { ...formData };
    const currentGroups = Array.isArray(newFormData[questionId]) ? newFormData[questionId] : [];
    newFormData[questionId] = currentGroups.filter((_, index) => index !== groupIndex);
    setFormData(newFormData);
    triggerAutoSave(newFormData);
  };

  // Update user data in Firestore
  const updateUserData = async (sectionId, newData) => {
    try {
      if (!user?.profile?.authUid) return;

      // Clean undefined values from the new data
      const cleanedData = cleanUndefinedValues(newData);

      // Handle email change for non-Google users
      if (cleanedData.email && user?.profile?.provider !== 'google.com' && cleanedData.email !== user.profile.email) {
        try {
          await verifyBeforeUpdateEmail(auth.currentUser, cleanedData.email);
          showToast('A verification email has been sent to your new email address. Please verify it before the change takes effect.', 'info');
          return;
        } catch (error) {
          if (error.code === 'auth/requires-recent-login') {
            throw new Error('Please log in again before changing your email address');
          }
          throw error;
        }
      }

      // Process the data to handle File objects
      const processedQuestions = section.questions.map(question => {
        const answer = cleanedData[question.id];
        
        // If it's a File object, we'll store the URL instead
        if (answer instanceof File) {
          return {
            id: question.id,
            type: question.type,
            question: question.question,
            required: question.required,
            answer: null // Will be updated after file upload
          };
        }

        // For repeater fields, check each entry for File objects
        if (question.type === 'repeater' && Array.isArray(answer)) {
          return {
            id: question.id,
            type: question.type,
            question: question.question,
            required: question.required,
            answer: answer.map(entry => {
              if (!entry || typeof entry !== 'object') return entry;
              
              const processedEntry = { ...entry };
              // Check each field in the entry for File objects
              question.repeaterFields?.forEach(field => {
                if (entry[field.id] instanceof File) {
                  processedEntry[field.id] = null; // Will be updated after file upload
                }
              });
              return processedEntry;
            })
          };
        }

        return {
          id: question.id,
          type: question.type,
          question: question.question,
          required: question.required,
          answer: answer
        };
      });

      // Create the section data object
      const sectionData = {
        id: section.id,
        label: section.label,
        profileType,
        questions: processedQuestions
      };

      // Update profile with the section data
      await updateProfile({
        profileSections: {
          [sectionId]: sectionData
        }
      });

      // Emit section update event
      eventEmitter.emit(EVENTS.SECTION_DATA_UPDATED);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Update handleFileChange to properly handle group field file uploads
  const handleFileChange = async (questionId, file, groupIndex, fieldId) => {
    let previewKey;
    
    try {
      console.log('Handling file change:', { questionId, file, groupIndex, fieldId });
      
      // Generate preview key for the specific field
      previewKey = groupIndex !== undefined && fieldId !== undefined
        ? `${questionId}_${groupIndex}_${fieldId}`
        : questionId;

      // Set loading state for this specific file
      setFileUploading(prev => ({
        ...prev,
        [previewKey]: true
      }));

      const newFormData = { ...formData };

      if (!file) {
        // Handle file removal
        if (groupIndex !== undefined && fieldId !== undefined) {
          // For repeater field
          if (!newFormData[questionId]) {
            newFormData[questionId] = [];
          }
          if (!newFormData[questionId][groupIndex]) {
            newFormData[questionId][groupIndex] = {};
          }
          newFormData[questionId][groupIndex][fieldId] = null;
        } else {
          // For standalone field
          newFormData[questionId] = null;
        }

        setFilePreviews(prev => ({
          ...prev,
          [previewKey]: null
        }));

        setFormData(newFormData);
        await debouncedSave(newFormData);
      } else {
        // Handle file upload
        const uploadPath = groupIndex !== undefined
          ? `users/${user.profile.authUid}/${section.id}/${questionId}/${groupIndex}/${fieldId}/${Date.now()}-${file.name}`
          : `users/${user.profile.authUid}/${section.id}/${questionId}/${Date.now()}-${file.name}`;

        // Create preview URL immediately
        const previewUrl = URL.createObjectURL(file);
        setFilePreviews(prev => ({
          ...prev,
          [previewKey]: previewUrl
        }));

        // Upload file
        const downloadURL = await uploadFile(file, uploadPath);
        const fileData = {
          url: downloadURL,
          name: file.name,
          type: file.type
        };

        if (groupIndex !== undefined && fieldId !== undefined) {
          // For repeater field
          if (!newFormData[questionId]) {
            newFormData[questionId] = [];
          }
          if (!newFormData[questionId][groupIndex]) {
            newFormData[questionId][groupIndex] = {};
          }
          newFormData[questionId][groupIndex][fieldId] = fileData;
        } else {
          // For standalone field
          newFormData[questionId] = fileData;
        }

        setFormData(newFormData);
        await debouncedSave(newFormData);
        showToast('File uploaded and saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error handling file:', error);
      showToast('Failed to upload file. Please try again.', 'error');
    } finally {
      if (previewKey) {
        // Clear loading state for this specific file
        setFileUploading(prev => ({
          ...prev,
          [previewKey]: false
        }));
      }
    }
  };

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      // Revoke all object URLs to avoid memory leaks
      Object.values(filePreviews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filePreviews]);

  // Handle rewrite requests
  const handleRewrite = async (questionId, groupIndex, fieldId) => {
    try {
      // Set loading state for specific field
      setEnhancingFields(prev => ({
        ...prev,
        [questionId]: true
      }));
      
      // Get the current text to rewrite
      let currentText;
      if (groupIndex !== undefined && fieldId !== undefined) {
        // Handle repeater field rewrite
        currentText = formData[questionId]?.[groupIndex]?.[fieldId];
      } else {
        // Handle regular field rewrite
        currentText = formData[questionId];
      }

      if (!currentText) {
        showToast('Please enter some text to rewrite', 'error');
        return;
      }

      // Get the question configuration to determine max length
      const question = section.questions.find(q => q.id === questionId);
      const maxLength = question?.validation?.maxLength || 500;

      // Call OpenAI to enhance the text
      const enhancedText = await generateProfessionalSummary(currentText, maxLength, user?.profile?.authUid);

      console.log('Received enhanced text:', enhancedText);

      // Update the form data with the enhanced text
      if (groupIndex !== undefined && fieldId !== undefined) {
        // Update repeater field
        const updatedGroups = [...(formData[questionId] || [])];
        if (!updatedGroups[groupIndex]) {
          updatedGroups[groupIndex] = {};
        }
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          [fieldId]: enhancedText
        };
        
        const newFormData = {
          ...formData,
          [questionId]: updatedGroups,
          hasBeenInitialized: true
        };
        
        console.log('Updating form data (repeater):', newFormData);
        setFormData(newFormData);
      } else {
        // Update regular field
        const newFormData = {
          ...formData,
          [questionId]: enhancedText,
          hasBeenInitialized: true
        };
        
        console.log('Updating form data (regular):', newFormData);
        setFormData(newFormData);
      }

      // Update user data in Firestore
      await updateUserData(section.id, formData);

      // Emit events to refresh data submission section and token usage stats
      eventEmitter.emit(EVENTS.SECTION_DATA_UPDATED);
      eventEmitter.emit(EVENTS.TOKEN_USAGE_UPDATED);

      showToast('Text enhanced successfully!', 'success');
    } catch (error) {
      console.error('Error in handleRewrite:', error);
      showToast(error.message || 'Failed to enhance text. Please try again.', 'error');
    } finally {
      // Clear loading state for specific field
      setEnhancingFields(prev => ({
        ...prev,
        [questionId]: false
      }));
    }
  };

  return {
    formData,
    errors,
    loading,
    fileUploading,
    enhancingFields,
    handleInputChange,
    handleMultiSelectChange,
    handleGroupFieldChange,
    handleAddGroup,
    handleRemoveGroup,
    handleFileChange,
    filePreviews,
    handleRewrite,
    setErrors
  };
};

export default useFormData; 