import { useCallback, useRef } from 'react';
import { eventEmitter, EVENTS } from '../../../../../../services/eventEmitter';
import { cleanUndefinedValues } from './utils';
import { mapFormDataToProfileSection } from './mappers';
import { AUTO_SAVE_CONSTANTS, ERROR_MESSAGES } from './constants';

export const useAutoSave = ({
  section,
  profileType,
  formData,
  updateProfile,
  showToast
}) => {
  const pendingChangesRef = useRef({});
  const saveTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);

  const saveBatchedChanges = useCallback(async () => {
    if (isSavingRef.current || !Object.keys(pendingChangesRef.current).length) {
      return;
    }

    try {
      isSavingRef.current = true;
      
      const changes = { ...pendingChangesRef.current };
      pendingChangesRef.current = {};

      const cleanedData = cleanUndefinedValues(changes);
      const mergedData = { ...formData, ...cleanedData };
      const profileSection = mapFormDataToProfileSection(mergedData, section, profileType);

      if (!profileSection) {
        throw new Error(ERROR_MESSAGES.SECTION.INVALID_DATA);
      }

      await updateProfile({
        profileSections: {
          [section.id]: profileSection
        }
      });

      eventEmitter.emit(EVENTS.SECTION_DATA_UPDATED, { silent: true });
    } catch (error) {
      pendingChangesRef.current = { ...pendingChangesRef.current, ...changes };
      
      if (!error.message?.toLowerCase().includes('network')) {
        showToast(ERROR_MESSAGES.SECTION.SAVE_PENDING, 'warning');
      }
      console.error('Auto-save failed:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [section, profileType, updateProfile, showToast, formData]);

  const queueChange = useCallback((questionId, value) => {
    pendingChangesRef.current[questionId] = value;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveBatchedChanges();
    }, AUTO_SAVE_CONSTANTS.DEBOUNCE_TIME_MS);
  }, [saveBatchedChanges]);

  return {
    queueChange,
    saveTimeoutRef
  };
}; 