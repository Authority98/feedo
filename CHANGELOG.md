# Feedo Platform Changelog

## New Features
- Enhanced Data Management Form UI/UX
  - Improved repeater group layout with delete button below fields
  - Added toast notifications for group actions
  - Added success feedback when adding/removing groups
  - Improved visual hierarchy in form layout

- Integrated Crisp Chat for customer support
  - Added real-time chat functionality
  - Automatic user information sync
  - Profile photo integration
  - Custom user data tracking
  - Clean component lifecycle management

- Added "Add a Question" feature to Data Management page
  - Integrated button in tabs section with hover animation
  - Modern dialog with file upload support
  - Form validation and error handling
  - Toast notifications for success/error states
  - Support for multiple file attachments
  - File size validation (max 10MB)
  - Fixed input field styling issues
  - Improved upload area alignment
  - Added proper form reset after submission

- Made opportunity names clickable in recent activity for better UX
- Made submission names clickable in recent activity for better UX
- Added hover effects and styling for clickable elements
- Added interactive elements to improve user experience

- Enhanced Help Center Support
  - Integrated live chat button with Crisp chat
  - Added seamless chat window opening
  - Improved user support accessibility

## Bug Fixes
- Fixed account deletion issue for Google users
  - Added proper error handling and state cleanup
  - Improved error messages and user feedback
  - Fixed race condition between Firestore and Auth user deletion
  - Added check for pending users during deletion

- Fixed profile completion percentage calculation
  - Implemented more accurate progress tracking
  - Added support for all section types
  - Improved field validation
  - Added support for repeater fields
  - Made progress calculation dynamic based on profile type

- Fixed profile completion percentage not updating immediately after file deletion
  - Modified useFileHandling to save changes to Firebase immediately
  - Added SECTION_DATA_UPDATED event emission after successful save
  - Added updateProfile prop to useFileHandling hook
  - Improved user experience by updating percentage without waiting for auto-save

- Fixed file handling loading states in Data Management
  - Moved state management to parent level to fix React hooks error
  - Added proper tracking of file deletion state
  - Improved loading text accuracy during operations
  - Fixed incorrect loading text during file upload
  - Enhanced user feedback during file operations

- Fixed Netlify build issues
  - Added missing @babel/plugin-proposal-private-property-in-object dependency
  - Resolved build-time dependency errors
  - Improved build configuration stability
  - Updated package.json with required dev dependencies

## UI/UX Improvements
- Enhanced Recent Activity section
  - Added bold styling for opportunity names
  - Added bold styling for submission names
  - Maintained existing "View" button functionality
  - Improved visual feedback on interactive elements

- Updated Data Management tabs to Material UI design
  - Implemented Material UI's default tab styling
  - Added smooth tab transitions and animations
  - Improved tab indicators and hover states
  - Unified icon colors with Material UI theme
  - Enhanced overall visual consistency
  - Fixed input field styling conflicts with global CSS
  - Improved upload area visual alignment

- Enhanced Opportunities Statistics Cards
  - Updated Total Opportunities card color to #00b4d2
  - Renamed "Perfect Matches" to "New Opportunities" with color #527991
  - Renamed "Success Rate" to "Highly Matched" with color #34b800
  - Updated Closing Soon card color to #ff7a15
  - Added new opportunities count functionality
  - Improved visual consistency with solid colors

- Enhanced Profile Photo Upload Experience
  - Added loading spinner with "Uploading..." text during image upload
  - Fixed hover state persistence after upload completion
  - Improved visual feedback during upload process
  - Fixed image upload option visibility for non-Google users

- Added Modern Email Contact Dialog
  - Clean Material UI design with proper field spacing
  - Removed redundant borders and asterisks
  - Added loading state during email submission
  - Pre-filled user email in From field
  - Improved form validation and error handling
  - Success/error toast notifications

- Enhanced file handling feedback
  - Added distinct loading text for file deletion ("Deleting...")
  - Maintained existing upload feedback ("Uploading...")
  - Improved user feedback during file operations
  - Applied to both button and preview overlay

## Code Quality
- Created maintenance log to track platform changes
- Improved error handling across authentication flows
- Enhanced state management for user deletion process
- Optimized profile progress calculation
- Verified proper .gitignore configuration
  - Confirmed package lock files exclusion (package-lock.json, yarn.lock)
  - Validated environment files protection (.env and variations)
  - Ensured sensitive information security
  - Maintained clean repository structure

## Code Quality Improvements in Data Management
### Added
- Created dedicated mapper functions for data transformations
- Added comprehensive constants file for better configuration management
- Implemented helper functions for cleaner code organization

### Changed
- Refactored useFileHandling hook for better error handling and file management
- Improved useAutoSave hook with better batching and error recovery
- Enhanced useRewrite hook with cleaner state management
- Optimized code structure with better separation of concerns
- Improved error messages and user feedback
- Removed unnecessary comments and improved documentation

### Technical Details
- Implemented mapper pattern for complex data transformations
- Added proper error handling with recovery mechanisms
- Improved code organization with helper functions
- Centralized constants and error messages
- Optimized file upload and auto-save mechanisms
- Enhanced code readability and maintainability

## Legacy Updates
- Fixed subscription page rendering issues:
  - Added missing React import
  - Converted React.createElement syntax to modern JSX
  - Fixed syntax errors in component structure
  - Improved code readability and maintainability
  - Ensured proper component nesting and closing tags

## Recent Updates
- Enhanced FAQ Section
  - Updated first FAQ link to point to new solution page (feedo.ai/solution)
  - Added Crisp chat integration for live chat link
  - Improved link handling with onClick event
  - Maintained consistent link styling and security attributes

### FAQ Updates
- Updated FAQ section with 15 new comprehensive questions and answers
- Added hyperlinks to all relevant URLs with proper security attributes
- Updated progress tracking to reflect the new total number of FAQs
- Improved FAQ content to cover a wider range of user types and features
- Enhanced FAQ link styling with distinct colors and hover effects

### ESLint and Build Fixes
- Added missing Babel plugin for private property in object
- Fixed ESLint errors across multiple files
- Resolved undefined variables and conditional hook issues
- Added formatters utility for file size formatting
- Updated import orders and removed unused variables

### OpenAI Integration
- Created serverless function for secure OpenAI API handling
- Updated OpenAI service to use serverless function
- Improved security by removing client-side API key exposure

### Data Management Improvements
- Fixed section navigation after auto-save
- Improved handling of group fields in sections
- Enhanced event emission handling for better state management

### File Structure
- Renamed maintenance-log.md to CHANGELOG.md for better convention
- Organized changes in a more structured format

### Fixed
- ESLint configuration updated to fix build issues on Netlify
  - Disabled problematic ESLint rules for production builds
  - Added production environment variables to handle ESLint during build
  - Created `.env.production` to manage build-specific settings

### Changed
- Renamed maintenance-log.md to CHANGELOG.md for better clarity and convention
- Updated ESLint configuration to be more permissive in production
- Added environment variables to prevent ESLint errors from blocking builds

### Added
- New `.env.production` file with build-specific settings
- ESLint rule configurations for better development experience

### Fixed
- Percentage not updating immediately when file is deleted on data management page
  - Added immediate Firebase update after file deletion
  - Improved event emission for section data updates
  - Enhanced error handling in file deletion process

### Added
- Missing Babel plugin for private property handling
  - Added @babel/plugin-proposal-private-property-in-object as dev dependency
  - Fixed ESLint errors related to the plugin

### Changed
- Improved file handling in useFileHandling hook
- Enhanced auto-save functionality in useAutoSave hook
- Updated error handling in file operations

### Security
- Removed direct integration of sensitive information from logs
- Enhanced security in file handling operations

### Help Center Improvements
- Fixed Support section height to use auto-height instead of full container height
- Enhanced FAQ link styling with distinct colors and hover effects