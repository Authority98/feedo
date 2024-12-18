import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../../firebase/config';

// Helper function to clean undefined values
export const cleanUndefinedValues = (obj) => {
  if (!obj) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' ? cleanUndefinedValues(item) : item
    ).filter(item => item !== undefined && item !== null);
  }
  if (typeof obj !== 'object') return obj;

  const cleaned = {};
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) continue;
    if (typeof obj[key] === 'object') {
      const cleanedValue = cleanUndefinedValues(obj[key]);
      if (cleanedValue !== null && cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    } else {
      cleaned[key] = obj[key];
    }
  }
  return Object.keys(cleaned).length ? cleaned : null;
};

// File upload utility
export const uploadFile = async (file, path) => {
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