/**
 * MyApplications Component
 * 
 * A comprehensive dashboard for managing job applications with advanced features and animations.
 * 
 * Key Features:
 * 1. Status Overview
 *    - Visual summary boxes showing counts for different application statuses
 *    - Interactive boxes that serve as filters
 *    - Animated counters and visual effects
 * 
 * 2. Search & Filtering
 *    - Real-time search across application names, categories, and statuses
 *    - Status-based filtering with visual feedback
 *    - Combined search and filter functionality
 * 
 * 3. Application Management
 *    - Tabulated view of all applications
 *    - Sortable columns
 *    - Status badges with distinct colors
 *    - Deadline tracking with visual indicators
 * 
 * 4. Actions & Interactions
 *    - View application details
 *    - Edit application information
 *    - Delete applications
 *    - Create new applications
 * 
 * 5. Pagination
 *    - Configurable items per page
 *    - Previous/Next navigation
 *    - Page tracking
 * 
 * 6. Responsive Design
 *    - Adapts to different screen sizes
 *    - Mobile-friendly interface
 *    - Flexible layout components
 * 
 * Technical Implementation:
 * - Uses React hooks for state management
 * - Implements custom animations and transitions
 * - Utilizes React Icons for consistent iconography
 * - Features optimized filtering and search algorithms
 * 
 * @component
 * @example
 * return (
 *   <MyApplications />
 * )
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { applicationOperations } from '../../../applications/applicationManager';
import { useLocation } from 'react-router-dom';
import {
  FiSearch, // Search/magnifying glass icon - Used for search functionality
  FiFilter, // Filter icon - Used for filtering applications
  FiEdit2, // Pencil icon - Used for editing applications
  FiTrash2, // Trash bin icon - Used for deleting applications
  FiClock, // Clock icon - Used for pending/time-related status
  FiFileText, // Document icon - Used for application/form representation
  FiAlertCircle, // Alert circle icon - Used for warnings or important notices
  FiRefreshCw, // Refresh icon - Used for refreshing data/status
  FiCheckCircle, // Check circle icon - Used for approved/success status
  FiXCircle, // X circle icon - Used for rejected/error status
  FiPlus, // Plus icon - Used for adding new applications
  FiEye, // Eye icon - Used for viewing application details
  FiChevronRight // Chevron icon - Used for navigation
} from 'react-icons/fi';
import './MyApplications.css';
import AnimatedNumber from '../../../components/Animated/AnimatedNumber';
import Button from '../../../components/Button/Button';
import EditApplicationPanel from './sections/EditApplicationPanel/EditApplicationPanel';
import DeleteConfirmationModal from './sections/DeleteConfirmationModal/DeleteConfirmationModal';
import ApplicationPanel from './sections/ApplicationPanel/ApplicationPanel';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import StatusBadge from '../../../components/StatusBadge/StatusBadge';

/**
 * Formats a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string (e.g., "Mar 15, 2024")
 */
const formatDate = (dateString) => {
  if (!dateString) {
    return 'No date set';
  }

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'Invalid date';
  }
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterLoading, setFilterLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editingApplication, setEditingApplication] = useState(null);
  const [deletingApplication, setDeletingApplication] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const location = useLocation();

  // Fetch applications and stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.profile?.authUid) return;

      try {
        setFilterLoading(true);
        const [applicationsData, statsData] = await Promise.all([
        applicationOperations.getUserApplications(user.profile.authUid, {
          status: filterStatus !== 'all' ? filterStatus : undefined
        }),
        applicationOperations.getApplicationStats(user.profile.authUid)]
        );

        setApplications(applicationsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setFilterLoading(false);
      }
    };

    fetchData();
  }, [user?.profile?.authUid, filterStatus]);

  // Effect to handle navigation state
  useEffect(() => {
    const handleNavigationState = () => {
      const { openApplicationId } = location.state || {};

      if (openApplicationId) {
        // Find and open specific application
        const application = applications.find((app) => app.id === openApplicationId);
        if (application) {
          setSelectedApplication(application);
        }
      }

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    };

    handleNavigationState();
  }, [location.state, applications]);

  /**
   * Creates a demo application for testing purposes
   * TODO: Remove this in production - This is only for demonstration
   */
  const createDemoApplication = () => {
    // Generate random company name from top tech companies
    const companies = ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Netflix', 'Tesla', 'Twitter'];
    const positions = ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'UI/UX Designer', 'Product Manager'];
    const categories = ['Technology', 'Development', 'Design', 'Product', 'Engineering'];
    const statuses = ['pending', 'approved', 'rejected', 'follow-up', 'incomplete'];

    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate a random future deadline between 7 and 90 days from now
    const minDays = 7;
    const maxDays = 90;
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + randomDays);

    // Create demo application data
    const demoApplication = {
      name: `${randomPosition} - ${randomCompany}`,
      category: randomCategory,
      description: `Exciting opportunity to work as a ${randomPosition} at ${randomCompany}.`,
      status: randomStatus,
      progress: Math.floor(Math.random() * 100), // Random progress 0-100
      userId: user.profile.authUid,
      submissionDate: new Date().toISOString(),
      deadline: deadline.toISOString(), // Random future deadline
      documents: [],
      interviews: [],
      notes: '',
      feedback: '',
      isArchived: false
    };

    return demoApplication;
  };

  /**
   * Handles the creation of a new application
   * TODO: In production, this should open a form modal instead of creating demo data
   */
  const handleCreateApplication = async () => {
    try {
      setDemoLoading(true);
      const demoApplication = createDemoApplication();

      // Create new application using applicationOperations
      const newApplication = await applicationOperations.createApplication(demoApplication);

      // Update local state
      setApplications((prev) => [newApplication, ...prev]);

      // Update stats - Add null check and initialize if needed
      setStats((prev) => {
        const currentStats = prev || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          incomplete: 0,
          followUp: 0
        };

        // Convert follow-up status to match stats key
        const statusKey = newApplication.status === 'follow-up' ? 'followUp' : newApplication.status;

        return {
          ...currentStats,
          total: currentStats.total + 1,
          [statusKey]: currentStats[statusKey] + 1
        };
      });


    } catch (err) {
      console.error('Error creating demo application:', err);
      setError('Failed to create application. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  // Handle application deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        setFilterLoading(true);
        await applicationOperations.deleteApplication(id);

        // Update local state
        const deletedApp = applications.find((app) => app.id === id);
        setApplications((prev) => prev.filter((app) => app.id !== id));

        // Update stats
        if (deletedApp) {
          setStats((prev) => ({
            ...prev,
            total: prev.total - 1,
            [deletedApp.status]: prev[deletedApp.status] - 1
          }));
        }
      } catch (err) {
        console.error('Error deleting application:', err);
        setError('Failed to delete application. Please try again.');
      } finally {
        setFilterLoading(false);
      }
    }
  };

  /**
   * Status summary object
   * Tracks the count of applications in each status category
   * Used for displaying status boxes and quick statistics
   */
  const statusSummary = stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    incomplete: 0,
    followUp: 0
  };

  /**
   * Handles search input changes
   * - Updates search term state
   * - Resets pagination to first page
   * @param {Event} event - Input change event
   */
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  /**
   * Filters applications based on current search term and status filter
   * Implements case-insensitive search across multiple fields
   * @returns {Array} Filtered applications array
   */
  const getFilteredApplications = () => {
    return applications.filter((app) => {
      // Status filter
      const statusMatch = filterStatus === 'all' ||
      filterStatus === 'follow-up' && app.status === 'follow-up' ||
      filterStatus === 'incomplete' && app.status === 'incomplete' ||
      app.status === filterStatus;

      // Search filter - case insensitive search across multiple fields
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = searchTerm === '' ||
      app.name.toLowerCase().includes(searchLower) ||
      app.category.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower);

      // Return true only if both status and search filters match
      return statusMatch && searchMatch;
    });
  };

  /**
   * Action handler for editing application
   * Opens edit form modal or navigates to edit page
   * @param {number} id - Application ID to edit
   */
  const handleEdit = (id) => {
    const application = applications.find((app) => app.id === id);
    if (application) {
      setEditingApplication(application);
    }
  };

  const handleUpdateApplication = (updatedApplication) => {
    setApplications((prev) => prev.map((app) =>
    app.id === updatedApplication.id ? updatedApplication : app
    ));
  };

  /**
   * Pagination helper functions
   * Calculate current page items and total pages
   */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getFilteredApplications().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(getFilteredApplications().length / itemsPerPage);

  /**
   * Pagination event handlers
   * Handle page navigation and boundary conditions
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Handles status filter changes
   * - Updates filter status state
   * - Resets pagination to first page
   * - Updates dropdown select value
   * @param {string} status - The new status filter value
   */
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle delete click
  const handleDeleteClick = (application) => {
    setDeletingApplication(application);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingApplication) return;

    try {
      setIsDeleting(true);
      await applicationOperations.deleteApplication(deletingApplication.id);

      // Update local state
      setApplications((prev) => prev.filter((app) => app.id !== deletingApplication.id));

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        [deletingApplication.status]: prev[deletingApplication.status] - 1
      }));

      // Close modal
      setDeletingApplication(null);
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeletingApplication(null);
  };

  // Add handler for viewing application details
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "my-applications-page" }, /*#__PURE__*/

    React.createElement("div", { className: "applications-header" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "create",
      onClick: handleCreateApplication,
      disabled: demoLoading,
      className: "w-auto px-10 inline-flex items-center" }, /*#__PURE__*/

    React.createElement(FiPlus, { className: "w-4 h-4 mr-2 inline-block" }), /*#__PURE__*/
    React.createElement("span", null, demoLoading ? 'Creating...' : 'Create Demo Application')
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "status-boxes" }, /*#__PURE__*/

    React.createElement("div", {
      className: `status-box total ${filterStatus === 'all' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('all'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by all applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiFileText, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Total"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.total })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", {
      className: `status-box pending ${filterStatus === 'pending' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('pending'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by pending applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiClock, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Pending"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.pending })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", {
      className: `status-box incomplete ${filterStatus === 'incomplete' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('incomplete'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by incomplete applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Incomplete"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.incomplete })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", {
      className: `status-box follow-up ${filterStatus === 'follow-up' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('follow-up'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by follow-up applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiRefreshCw, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Follow-Up"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.followUp })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", {
      className: `status-box approved ${filterStatus === 'approved' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('approved'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by approved applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiCheckCircle, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Approved"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.approved })
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", {
      className: `status-box rejected ${filterStatus === 'rejected' ? 'active' : ''}`,
      onClick: () => handleStatusFilter('rejected'),
      role: "button",
      tabIndex: 0,
      "aria-label": "Filter by rejected applications" }, /*#__PURE__*/

    React.createElement("div", { className: "status-icon" }, /*#__PURE__*/
    React.createElement(FiXCircle, { size: 24 })
    ), /*#__PURE__*/
    React.createElement("div", { className: "status-content" }, /*#__PURE__*/
    React.createElement("div", { className: "status-label" }, "Rejected"), /*#__PURE__*/
    React.createElement("div", { className: "status-value" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: statusSummary.rejected })
    )
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "search-filter-section" }, /*#__PURE__*/
    React.createElement("div", { className: "flex items-center gap-4 justify-end" }, /*#__PURE__*/

    React.createElement("div", { className: "search-bar" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Search job applications...",
      value: searchTerm,
      onChange: handleSearch,
      className: "search-input",
      "aria-label": "Search applications" }
    )
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "applications-table" }, /*#__PURE__*/
    React.createElement("table", null, /*#__PURE__*/

    React.createElement("thead", null, /*#__PURE__*/
    React.createElement("tr", null, /*#__PURE__*/
    React.createElement("th", null, "Application Name"), /*#__PURE__*/
    React.createElement("th", null, "Deadline"), /*#__PURE__*/
    React.createElement("th", null, "Status"), /*#__PURE__*/
    React.createElement("th", null, "Category"), /*#__PURE__*/
    React.createElement("th", null, "Actions")
    )
    ), /*#__PURE__*/


    React.createElement("tbody", null,
    filterLoading ? /*#__PURE__*/
    React.createElement("tr", null, /*#__PURE__*/
    React.createElement("td", { colSpan: "5" }, /*#__PURE__*/
    React.createElement("div", { className: "loading-state" }, /*#__PURE__*/
    React.createElement(LoadingSpinner, { size: "lg", isBackend: true, text: "Loading applications..." })
    )
    )
    ) :
    error ? /*#__PURE__*/
    React.createElement("tr", null, /*#__PURE__*/
    React.createElement("td", { colSpan: "5" }, /*#__PURE__*/
    React.createElement("div", { className: "error-state p-8 text-center text-gray-500" },
    error
    )
    )
    ) :
    currentItems.length === 0 ? /*#__PURE__*/
    React.createElement("tr", null, /*#__PURE__*/
    React.createElement("td", { colSpan: "5" }, /*#__PURE__*/
    React.createElement("div", { className: "empty-state p-4 text-center text-gray-500" },
    searchTerm || filterStatus !== 'all' ?
    'No applications found matching your search.' :
    'No applications yet.'
    )
    )
    ) :

    currentItems.map((app) => /*#__PURE__*/
    React.createElement("tr", { key: app.id }, /*#__PURE__*/

    React.createElement("td", null, /*#__PURE__*/
    React.createElement("button", {
      onClick: () => handleViewApplication(app),
      className: "text-left group flex items-center gap-2 hover:text-blue-600 transition-colors duration-200" }, /*#__PURE__*/

    React.createElement("span", { className: "relative" },
    app.name, /*#__PURE__*/
    React.createElement("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" })
    ), /*#__PURE__*/
    React.createElement(FiChevronRight, { className: "w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" })
    )
    ), /*#__PURE__*/


    React.createElement("td", null, formatDate(app.deadline)), /*#__PURE__*/


    React.createElement("td", null, /*#__PURE__*/
    React.createElement(StatusBadge, {
      status: app.status,
      variant: "application" }
    )
    ), /*#__PURE__*/


    React.createElement("td", null, app.category), /*#__PURE__*/


    React.createElement("td", null, /*#__PURE__*/
    React.createElement("div", { className: "action-buttons" }, /*#__PURE__*/
    React.createElement("button", {
      onClick: () => handleViewApplication(app),
      className: "action-btn view",
      title: "View Application Details",
      "aria-label": `View details of ${app.name}` }, /*#__PURE__*/

    React.createElement(FiEye, null)
    ), /*#__PURE__*/
    React.createElement("button", {
      onClick: () => handleEdit(app.id),
      className: "action-btn edit",
      title: "Edit Application",
      "aria-label": `Edit ${app.name}` }, /*#__PURE__*/

    React.createElement(FiEdit2, null)
    ), /*#__PURE__*/
    React.createElement("button", {
      onClick: () => handleDeleteClick(app),
      className: "action-btn delete",
      title: "Delete Application",
      "aria-label": `Delete ${app.name}` }, /*#__PURE__*/

    React.createElement(FiTrash2, null)
    )
    )
    )
    )
    )

    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "pagination" }, /*#__PURE__*/
    React.createElement("div", { className: "pagination-numbers" },

    currentPage > 3 && /*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("button", {
      className: `pagination-number ${currentPage === 1 ? 'active' : ''}`,
      onClick: () => handlePageChange(1) },
    "1"

    ),
    currentPage > 4 && /*#__PURE__*/React.createElement("span", { className: "pagination-ellipsis" }, "...")
    ),



    Array.from({ length: totalPages }, (_, i) => i + 1).
    filter((page) => {
      if (totalPages <= 7) return true;
      if (page === 1 || page === totalPages) return true;
      if (Math.abs(currentPage - page) <= 1) return true;
      return false;
    }).
    map((page) => /*#__PURE__*/
    React.createElement("button", {
      key: page,
      className: `pagination-number ${currentPage === page ? 'active' : ''}`,
      onClick: () => handlePageChange(page) },

    page
    )
    ),


    currentPage < totalPages - 2 && /*#__PURE__*/
    React.createElement(React.Fragment, null,
    currentPage < totalPages - 3 && /*#__PURE__*/React.createElement("span", { className: "pagination-ellipsis" }, "..."), /*#__PURE__*/
    React.createElement("button", {
      className: `pagination-number ${currentPage === totalPages ? 'active' : ''}`,
      onClick: () => handlePageChange(totalPages) },

    totalPages
    )
    )

    )
    ),

    editingApplication && /*#__PURE__*/
    React.createElement(EditApplicationPanel, {
      application: editingApplication,
      onClose: () => setEditingApplication(null),
      onUpdate: handleUpdateApplication }
    ),



    deletingApplication && /*#__PURE__*/
    React.createElement(DeleteConfirmationModal, {
      application: deletingApplication,
      onConfirm: handleDeleteConfirm,
      onCancel: handleDeleteCancel,
      isLoading: isDeleting }
    ), /*#__PURE__*/



    React.createElement(ApplicationPanel, {
      isOpen: !!selectedApplication,
      onClose: () => setSelectedApplication(null),
      application: selectedApplication }
    )
    ));

};

export default MyApplications;