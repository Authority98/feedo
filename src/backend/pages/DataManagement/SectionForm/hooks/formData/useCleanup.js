import { useEffect } from 'react';

export const useCleanup = ({ saveTimeoutRef, filePreviews }) => {
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Cleanup file previews
      Object.values(filePreviews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filePreviews, saveTimeoutRef]);
}; 