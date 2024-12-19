/**
 * Maps form data to the profile section format required by the backend
 */
export const mapFormDataToProfileSection = (formData, section, profileType) => {
  if (!section?.id || !section.questions) return null;

  return {
    id: section.id,
    label: section.label,
    profileType,
    questions: section.questions
      .map(question => {
        if (!question?.id) return null;
        
        const answer = formData[question.id];
        if (answer === undefined) return null;

        // For file type questions, preserve the entire file data structure
        if (question.type === 'file' && answer) {
          return {
            id: question.id,
            type: question.type,
            answer: {
              url: answer.url,
              name: answer.name,
              type: answer.type
            }
          };
        }

        return {
          id: question.id,
          type: question.type,
          answer
        };
      })
      .filter(Boolean)
  };
};

/**
 * Maps section data from backend to form data format
 */
export const mapSectionDataToFormData = (userSectionData, sectionQuestions) => {
  if (!sectionQuestions) return {};

  const savedFormData = {};

  sectionQuestions.forEach((question) => {
    if (!question?.id) return;

    try {
      if (question.type === 'repeater') {
        // Initialize repeater fields with at least one empty group
        const repeaterData = [];
        const existingData = userSectionData?.questions?.find((q) => q.id === question.id)?.answer;

        if (Array.isArray(existingData) && existingData.length > 0) {
          // Map existing data and ensure all required fields exist
          repeaterData.push(...existingData.map((group) => ({
            ...Object.fromEntries(
              (question.repeaterFields || []).map((field) => [
                field.id,
                field.type === 'multipleChoice' ? [] : ''
              ])
            ),
            ...group
          })));
        } else {
          // Create one empty group with all fields initialized
          repeaterData.push(
            Object.fromEntries(
              (question.repeaterFields || []).map((field) => [
                field.id,
                field.type === 'multipleChoice' ? [] : ''
              ])
            )
          );
        }
        savedFormData[question.id] = repeaterData;
      } else if (question.type === 'multipleChoice') {
        // Initialize multiple choice fields as arrays
        savedFormData[question.id] = userSectionData?.questions?.find((q) => q.id === question.id)?.answer || [];
      } else if (question.type === 'file') {
        // Initialize file fields with null or existing data
        const fileData = userSectionData?.questions?.find((q) => q.id === question.id)?.answer;
        savedFormData[question.id] = fileData ? {
          url: fileData.url,
          name: fileData.name,
          type: fileData.type
        } : null;
      } else {
        // Initialize all other fields with empty string or existing data
        savedFormData[question.id] = userSectionData?.questions?.find((q) => q.id === question.id)?.answer || '';
      }
    } catch (error) {
      console.error('Error initializing question:', question.id, error);
      savedFormData[question.id] = question.type === 'multipleChoice' ? [] : '';
    }
  });

  return savedFormData;
};

/**
 * Maps file data to the format required by the form
 */
export const mapFileDataToFormData = (file, downloadURL) => ({
  url: downloadURL,
  name: file.name,
  type: file.type
}); 