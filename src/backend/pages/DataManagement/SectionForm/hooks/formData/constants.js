/**
 * Constants for file handling operations
 * Includes size limits, separators, and path configurations
 */
export const FILE_CONSTANTS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB in bytes
  PREVIEW_KEY_SEPARATOR: '_',
  UPLOAD_PATH_SEPARATOR: '/',
};

/**
 * Default values for form fields based on their types
 * Used for initialization and reset operations
 */
export const FIELD_CONSTANTS = {
  DEFAULT_MAX_LENGTH: 500,
  DEFAULT_TEXT_VALUE: '',
  DEFAULT_ARRAY_VALUE: [],
  DEFAULT_FILE_VALUE: null,
};

/**
 * Configuration for auto-save functionality
 * Timing and throttling settings
 */
export const AUTO_SAVE_CONSTANTS = {
  DEBOUNCE_TIME_MS: 2000, // 2 seconds
};

/**
 * User-facing messages for various operations and states
 * Grouped by feature area for better organization
 */
export const ERROR_MESSAGES = {
  LOGIN_REQUIRED: {
    FILE_UPLOAD: 'Please log in to upload files',
    REWRITE: 'Please log in to use the rewrite feature'
  },
  FILE: {
    SIZE_LIMIT: 'File size must be less than 10MB',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    UPLOAD_SUCCESS: 'File uploaded successfully!'
  },
  REWRITE: {
    NO_TEXT: 'Please enter some text to rewrite',
    NO_CONFIG: 'Question configuration not found',
    ENHANCE_FAILED: 'Failed to enhance text. Please try again.',
    ENHANCE_SUCCESS: 'Text enhanced successfully!'
  },
  SECTION: {
    LOAD_FAILED: 'Failed to load section data. Please try again later.',
    INVALID_DATA: 'Invalid section data',
    SAVE_PENDING: 'Changes will be saved when connection is restored'
  }
}; 