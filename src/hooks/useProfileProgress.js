import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useProfileProgress = () => {
  const { user, loading: authLoading } = useAuth();
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionItems, setSubmissionItems] = useState([]);

  // Helper function to check section completion
  const checkSectionCompletion = (sectionId, questions, profileSections) => {





    if (!questions || !profileSections) {

      return false;
    }

    const sectionData = profileSections[sectionId];


    if (!sectionData || !sectionData.questions) {

      return false;
    }

    // Helper function to check if a value is empty
    const isEmptyValue = (value, type) => {
      if (value === undefined || value === null) return true;

      switch (type) {
        case 'file':
          if (!value) return true;
          if (typeof value === 'object' && !value.url) return true;
          if (typeof value === 'string' && !value.trim()) return true;
          return false;

        case 'multipleChoice':
        case 'checkbox':
          if (!Array.isArray(value)) return true;
          if (value.length === 0) return true;
          return false;

        case 'singleChoice':
        case 'dropdown':
        case 'select':
        case 'date':
          if (!value) return true;
          if (typeof value === 'string' && !value.trim()) return true;
          if (value === 'none') return true;
          return false;

        case 'text':
        case 'textarea':
          if (!value) return true;
          if (typeof value === 'string' && !value.trim()) return true;
          return false;

        case 'phone':
          if (!value || typeof value !== 'object') return true;
          if (!value.countryCode || !value.number) return true;
          if (typeof value.number === 'string' && !value.number.trim()) return true;
          return false;

        default:
          if (!value) return true;
          if (typeof value === 'string' && !value.trim()) return true;
          if (Array.isArray(value) && value.length === 0) return true;
          return false;
      }
    };

    // Check all questions
    for (const question of questions) {



      const questionData = sectionData.questions.find((q) => q.id === question.id);


      if (question.type === 'repeater') {
        // For repeater type
        const repeaterAnswer = questionData?.answer;

        // If there's no array or it's empty, consider it incomplete
        if (!Array.isArray(repeaterAnswer) || repeaterAnswer.length === 0) {
          return false;
        }

        // Check each entry in the repeater
        for (const entry of repeaterAnswer) {
          if (!entry || typeof entry !== 'object') {
            return false;
          }

          // Check each field in the repeater
          for (const field of question.repeaterFields || []) {
            const value = entry[field.id];
            if (isEmptyValue(value, field.type)) {
              return false;
            }
          }
        }
      } else {
        // For all other types
        const value = questionData?.answer;
        if (isEmptyValue(value, question.type)) {
          return false;
        }
      }
    }

    return true;
  };

  // Fetch section configuration and calculate initial progress
  const fetchSectionConfig = async () => {
    try {
      if (!user?.profile?.userType) {

        setSections([]);
        setSubmissionItems([]);
        setProgress(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Get the admin profiles document
      const profilesDocRef = doc(db, 'admin', 'profiles');
      const profilesDoc = await getDoc(profilesDocRef);

      if (!profilesDoc.exists()) {

        setSections([]);
        setSubmissionItems([]);
        setProgress(0);
        setIsLoading(false);
        return;
      }

      const data = profilesDoc.data();
      const userProfileType = data.profileTypes[user.profile.userType];

      if (!userProfileType?.sections) {

        setSections([]);
        setSubmissionItems([]);
        setProgress(0);
        setIsLoading(false);
        return;
      }

      // Convert sections to array format
      const sectionsArray = Object.entries(userProfileType.sections).map(([id, section]) => ({
        id,
        ...section
      }));

      // Convert sections to submission items
      const items = sectionsArray.map((section) => ({
        id: section.id,
        type: section.label,
        status: 'incomplete', // Will be updated in updateProgress
        label: 'Complete Now',
        isNew: false,
        questions: section.questions?.map((q) => ({
          id: q.id,
          required: q.required,
          type: q.type,
          repeaterFields: q.type === 'repeater' ? q.repeaterFields?.map((field) => ({
            id: field.id,
            required: field.required,
            type: field.type
          })) : null
        })) || []
      }));

      // Calculate initial progress
      const updatedItems = items.map((item) => {
        const isComplete = checkSectionCompletion(item.id, item.questions, user.profileSections);
        return {
          ...item,
          status: isComplete ? 'complete' : 'incomplete',
          label: isComplete ? 'Completed' : 'Complete Now'
        };
      });

      // Calculate weighted progress
      const totalFields = updatedItems.reduce((sum, item) => {

        return sum + item.questions.reduce((questionSum, question) => {
          if (question.type === 'repeater') {
            // Get the actual number of groups in the repeater
            const sectionData = user.profileSections[item.id];
            const questionData = sectionData?.questions?.find((q) => q.id === question.id);
            const groupCount = Array.isArray(questionData?.answer) ? questionData.answer.length : 1;
            const repeaterFields = question.repeaterFields?.length || 0;

            return questionSum + repeaterFields * groupCount;
          }

          return questionSum + 1;
        }, 0);
      }, 0);



      const completedFields = updatedItems.reduce((sum, item) => {
        if (!user.profileSections[item.id]) return sum;

        return sum + item.questions.reduce((fieldSum, question) => {
          const questionData = user.profileSections[item.id].questions.find((q) => q.id === question.id);


          if (!questionData || questionData.answer === undefined || questionData.answer === null) {

            return fieldSum;
          }

          switch (question.type) {
            case 'repeater':
              if (!Array.isArray(questionData.answer)) return fieldSum;

              // Count each filled field in each group
              return fieldSum + questionData.answer.reduce((entrySum, entry) => {
                if (!entry || typeof entry !== 'object') return entrySum;

                const filledFieldsInGroup = (question.repeaterFields || []).reduce((fieldCount, field) => {
                  const value = entry[field.id];
                  // Stricter validation for field values
                  if (value === undefined || value === null || value === '' ||
                  typeof value === 'string' && !value.trim() ||
                  Array.isArray(value) && value.length === 0) {
                    return fieldCount;
                  }
                  // Additional type-specific validation
                  switch (field.type) {
                    case 'file':
                      if (typeof value === 'object' && !value.url) return fieldCount;
                      break;
                    case 'multipleChoice':
                    case 'checkbox':
                      if (!Array.isArray(value) || value.length === 0) return fieldCount;
                      break;
                  }
                  return fieldCount + 1;
                }, 0);

                return entrySum + filledFieldsInGroup;
              }, 0);

            case 'multipleChoice':
            case 'checkbox':
              if (!Array.isArray(questionData.answer) || questionData.answer.length === 0) {

                return fieldSum;
              }

              return fieldSum + 1;

            case 'singleChoice':
            case 'dropdown':
            case 'select':
            case 'date':
              if (!questionData.answer || questionData.answer.trim() === '') {

                return fieldSum;
              }

              return fieldSum + 1;

            case 'phone':
              const phoneValue = questionData.answer;
              if (!phoneValue ||
              typeof phoneValue !== 'object' ||
              !phoneValue.countryCode ||
              !phoneValue.number ||
              !phoneValue.number.trim()) {

                return fieldSum;
              }

              return fieldSum + 1;

            default:
              if (questionData.answer === undefined ||
              questionData.answer === null ||
              questionData.answer === '' ||
              Array.isArray(questionData.answer) && questionData.answer.length === 0) {

                return fieldSum;
              }

              return fieldSum + 1;
          }
        }, 0);
      }, 0);



      const calculatedProgress = totalFields > 0 ?
      Math.round(completedFields / totalFields * 100) : 0;







      setSections(sectionsArray);
      setSubmissionItems(updatedItems);
      setProgress(calculatedProgress);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching section configuration:', error);
      setSections([]);
      setSubmissionItems([]);
      setProgress(0);
      setIsLoading(false);
    }
  };

  // Update progress when profile sections change
  useEffect(() => {
    if (!authLoading) {
      fetchSectionConfig();
    }
  }, [user?.profile?.userType, authLoading, user?.profileSections]);

  // Get missing steps
  const getMissingSteps = () => {
    if (!sections.length || !user?.profile?.userType) {
      return {
        sections: [],
        message: null
      };
    }

    // For new users or empty profileSections, all sections are missing
    if (!user?.profileSections || Object.keys(user.profileSections).length === 0) {
      const missingSections = sections.map((section) => ({
        id: section.id,
        label: section.label
      }));

      return {
        sections: missingSections,
        message: 'Complete all required sections in your profile'
      };
    }

    // Get incomplete sections
    const incompleteSections = sections.filter((section) =>
    !checkSectionCompletion(section.id, section.questions, user.profileSections)
    ).map((section) => ({
      id: section.id,
      label: section.label
    }));

    if (incompleteSections.length > 1) {
      return {
        sections: incompleteSections,
        message: 'Complete all required sections in your profile'
      };
    } else if (incompleteSections.length === 1) {
      return {
        sections: incompleteSections,
        message: `Complete your ${incompleteSections[0].label.toLowerCase()}`
      };
    }

    return {
      sections: [],
      message: null
    };
  };

  return {
    sections,
    progress,
    isLoading,
    submissionItems,
    checkSectionCompletion,
    getMissingSteps
  };
};

export default useProfileProgress;