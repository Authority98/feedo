import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../../firebase/config';
import { eventEmitter, EVENTS } from '../../../../../../services/eventEmitter';
import { mapSectionDataToFormData } from './mappers';

export const useSectionData = (user, section) => {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSectionData = useCallback(async () => {
    if (!user?.profile?.authUid || !section?.id) {
      setSectionData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the saved form data from user's profile sections
      const userSectionData = user?.profileSections?.[section.id];
      
      // Map section data to form data format
      const formData = mapSectionDataToFormData(userSectionData, section.questions);
      setSectionData(formData);
    } catch (error) {
      console.error('Error fetching section data:', error);
      setError('Failed to load section data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.profile?.authUid, user?.profileSections, section]);

  // Initial fetch
  useEffect(() => {
    fetchSectionData();
  }, [fetchSectionData]);

  // Listen for section updates
  useEffect(() => {
    const unsubscribe = eventEmitter.on(EVENTS.SECTION_DATA_UPDATED, ({ silent } = {}) => {
      if (!silent) {
        fetchSectionData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchSectionData]);

  return {
    sectionData,
    loading,
    error,
    refetch: fetchSectionData
  };
}; 