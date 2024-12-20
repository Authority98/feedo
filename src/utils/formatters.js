/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size with appropriate unit
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}; 