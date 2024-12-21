/**
 * NewOpportunities Page Component
 * 
 * This component displays a comprehensive list of funding opportunities and grants.
 * Key features include:
 * - Searchable opportunities list with pagination
 * - Match percentage visualization for each opportunity
 * - Application progress tracking
 * - Interactive "Apply Now" functionality with slide panel
 * - Responsive design for various screen sizes
 * 
 * Component Structure:
 * - StatCards (top metrics)
 * - Search functionality
 * - Opportunities table with progress bars
 * - Pagination controls
 * - Slide panel for opportunity details
 */

import React, { useState, useEffect } from 'react';
// Icon component for visual indicators
import { FiChevronDown, FiPlus, FiChevronRight } from 'react-icons/fi';
// Custom components for page sections
import StatCards from './sections/StatCards/StatCards';
import './NewOpportunities.css';
// Animated number component for dynamic values
import AnimatedNumber from '../../../components/Animated/AnimatedNumber';
// Navigation hook for routing
import { useNavigate, useLocation } from 'react-router-dom';
// Panel components for detailed views
import SlidePanel from './sections/SlidePanel/SlidePanel';
import OpportunityDetails from './sections/OpportunityDetails/OpportunityDetails';
// Add imports
import { useAuth } from '../../../auth/AuthContext';
import { opportunityOperations, createOpportunityDataStructure } from '../../../applications/applicationManager';
// First, add Button to imports at the top
import Button from '../../../components/Button/Button';

// Add this helper function near the top of the file
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If deadline is today
  if (diffDays === 0) {
    return 'Today';
  }

  // If deadline is tomorrow
  if (diffDays === 1) {
    return 'Tomorrow';
  }

  // If deadline is within next 7 days
  if (diffDays > 0 && diffDays <= 7) {
    return `${diffDays} days left`;
  }

  // For other dates, show formatted date
  const options = {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  };

  return date.toLocaleDateString('en-US', options);
};

const NewOpportunities = () => {
  const location = useLocation();
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Changed from 5 to 10 items per page
  const navigate = useNavigate();
  // State for selected opportunity details
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  // Add state and auth
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);

  // Effect to handle navigation state
  useEffect(() => {
    const handleNavigationState = async () => {
      if (!user?.profile?.authUid) return;

      const { openOpportunityId, openOpportunitiesPanel } = location.state || {};

      if (openOpportunityId) {
        // Find and open specific opportunity
        const opportunity = opportunities.find((opp) => opp.id === openOpportunityId);
        if (opportunity) {
          setSelectedOpportunity(opportunity);
        }
      } else if (openOpportunitiesPanel) {
        // Open the first opportunity if available
        if (opportunities.length > 0) {
          setSelectedOpportunity(opportunities[0]);
        }
      }

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    };

    handleNavigationState();
  }, [location.state, opportunities, user?.profile?.authUid]);

  // Add createDemoOpportunity function
  const createDemoOpportunity = () => {
    const companies = ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Netflix', 'Tesla', 'Twitter'];
    const positions = ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'UI/UX Designer', 'Product Manager'];
    const categories = ['Technology', 'Development', 'Design', 'Product', 'Engineering'];
    const statuses = ['new', 'active', 'closing-soon'];
    const locations = ['remote', 'onsite', 'hybrid'];

    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    return {
      title: `${randomPosition} at ${randomCompany}`,
      type: 'job',
      creatorId: user.profile.authUid,
      description: `Exciting opportunity to work as a ${randomPosition} at ${randomCompany}.`,
      category: randomCategory,
      status: randomStatus,
      location: {
        type: randomLocation,
        country: 'United Kingdom',
        city: 'London'
      },
      requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of professional experience',
      'Strong problem-solving skills',
      'Excellent communication skills'],

      compensation: {
        type: 'paid',
        amount: Math.floor(Math.random() * (150000 - 50000) + 50000),
        currency: 'GBP',
        details: 'Annual salary + benefits'
      },
      visibility: 'public'
    };
  };

  // Add useEffect to fetch opportunities when component mounts
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!user?.profile?.authUid) return;

      try {
        setLoading(true);
        const [fetchedOpportunities, statsData] = await Promise.all([
        opportunityOperations.getOpportunities({
          userId: user.profile.authUid
        }),
        opportunityOperations.getOpportunityStats(user.profile.authUid)]
        );

        // Log the fetched data for debugging


        // Update state with fetched data
        setOpportunities(fetchedOpportunities || []);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Call fetchOpportunities when component mounts or user changes
    fetchOpportunities();
  }, [user?.profile?.authUid]); // Add user ID to dependencies

  // Update handleCreateDemoOpportunity to use the user's ID
  const handleCreateDemoOpportunity = async () => {
    if (!user?.profile?.authUid) return;

    try {
      setLoading(true);
      const demoOpportunity = createDemoOpportunity();
      const opportunityData = createOpportunityDataStructure({
        ...demoOpportunity,
        creatorId: user.profile.authUid
      });

      // Create new opportunity using opportunityOperations
      const newOpportunity = await opportunityOperations.createOpportunity(opportunityData);

      // Update local state
      setOpportunities((prev) => [newOpportunity, ...prev]);

      // Trigger stats refresh
      setStatsRefreshTrigger((prev) => prev + 1);


    } catch (err) {
      console.error('Error creating demo opportunity:', err);
      setError('Failed to create opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add effect to reset pagination when filter changes
  useEffect(() => {
    if (activeFilter || searchTerm) {
      console.log(`Filter/Search changed - Resetting to page 1. Active Filter: ${activeFilter}, Search Term: ${searchTerm}`);
    }
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  // Filter opportunities based on search term, deadline, and active filter
  const filteredOpportunities = opportunities.filter((opp) => {
    console.group(`Filtering opportunity: ${opp.title} (ID: ${opp.id})`);
    
    // Check if it matches the search term first (most lightweight check)
    const matchesSearch = !searchTerm ||
      (opp.title && opp.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opp.description && opp.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) {
      console.log('❌ Failed search term match');
      console.groupEnd();
      return false;
    }
    console.log('✅ Passed search term match');

    // Check if the opportunity is still active (not passed deadline)
    let isActive = true;
    if (opp.deadline) {
      const deadline = new Date(opp.deadline);
      if (!isNaN(deadline.getTime())) {
        const now = new Date();
        isActive = deadline > now;
        console.log(`Deadline check: ${deadline.toISOString()} vs Now: ${now.toISOString()} - ${isActive ? '✅ Active' : '❌ Expired'}`);
      } else {
        console.log('⚠️ Invalid deadline date format');
      }
    } else {
      console.log('ℹ️ No deadline set');
    }

    if (!isActive) {
      console.groupEnd();
      return false;
    }

    // Check if it matches the active filter
    if (!activeFilter) {
      console.log('✅ No active filter, including opportunity');
      console.groupEnd();
      return true;
    }

    const now = new Date();
    console.log(`Applying filter: ${activeFilter}`);
    
    let filterResult = false;
    switch (activeFilter) {
      case 'new':
        if (!opp.createdAt) {
          console.log('❌ No creation date');
          break;
        }
        const createdDate = new Date(opp.createdAt);
        if (isNaN(createdDate.getTime())) {
          console.log('❌ Invalid creation date format');
          break;
        }
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filterResult = createdDate >= sevenDaysAgo;
        console.log(`Creation date: ${createdDate.toISOString()} vs 7 days ago: ${sevenDaysAgo.toISOString()} - ${filterResult ? '✅ New' : '❌ Old'}`);
        break;

      case 'matches':
        filterResult = typeof opp.matchPercentage === 'number' && opp.matchPercentage >= 90;
        console.log(`Match percentage: ${opp.matchPercentage}% - ${filterResult ? '✅ High match' : '❌ Low match'}`);
        break;

      case 'closing':
        if (!opp.deadline) {
          console.log('❌ No deadline set');
          break;
        }
        const deadline = new Date(opp.deadline);
        if (isNaN(deadline.getTime())) {
          console.log('❌ Invalid deadline format');
          break;
        }
        const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        filterResult = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
        console.log(`Days until deadline: ${daysUntilDeadline} - ${filterResult ? '✅ Closing soon' : '❌ Not closing soon'}`);
        break;

      case 'total':
        filterResult = true;
        console.log('✅ Showing all opportunities');
        break;

      default:
        filterResult = true;
        console.log('⚠️ Unknown filter, including opportunity');
    }

    console.log(`Final filter result: ${filterResult ? '✅ Included' : '❌ Excluded'}`);
    console.groupEnd();
    return filterResult;
  });

  // Log pagination info
  useEffect(() => {
    console.log(`
Pagination Update:
- Total opportunities: ${opportunities.length}
- Filtered opportunities: ${filteredOpportunities.length}
- Current page: ${currentPage}
- Items per page: ${itemsPerPage}
- Total pages: ${totalPages}
- Showing items ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredOpportunities.length)}
    `);
  }, [currentPage, filteredOpportunities.length, opportunities.length]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);

  // Navigation handlers for pagination
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Handler for opportunity selection
  const handleApplyClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "new-opportunities-page" }, /*#__PURE__*/
    React.createElement("div", { className: "flex justify-end items-center mb-8" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "create",
      onClick: handleCreateDemoOpportunity,
      disabled: loading,
      className: "w-auto px-10 inline-flex items-center" }, /*#__PURE__*/

    React.createElement(FiPlus, { className: "w-4 h-4 mr-2 inline-block" }), /*#__PURE__*/
    React.createElement("span", null, "Create Demo Opportunity")
    )
    ), /*#__PURE__*/

    React.createElement(StatCards, { refreshTrigger: statsRefreshTrigger, onFilterChange: setActiveFilter, activeFilter: activeFilter }), /*#__PURE__*/


    React.createElement("div", { className: "opportunities-section" }, /*#__PURE__*/
    React.createElement("div", { className: "section-header" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, "List of Opportunities"), /*#__PURE__*/


    React.createElement("div", { className: "search-container" }, /*#__PURE__*/
    React.createElement("div", { className: "search-bar" }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Search opportunities...",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value),
      className: "search-input" }
    )
    )
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "opportunities-table" }, /*#__PURE__*/

    React.createElement("div", { className: "table-header" }, /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }, "Opportunity Name"), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }, "Match Percentage"), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }, "Application Progress"), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }, "Deadline"), /*#__PURE__*/
    React.createElement("div", { className: "header-cell" }, "Action")
    ),

    loading ? /*#__PURE__*/
    React.createElement("div", { className: "loading-state p-8 text-center text-gray-500" }, "Loading opportunities..."

    ) :
    error ? /*#__PURE__*/
    React.createElement("div", { className: "error-state p-8 text-center text-red-500" },
    error
    ) :
    filteredOpportunities.length === 0 ? /*#__PURE__*/
    React.createElement("div", { className: "empty-state p-8 text-center text-gray-500" },
    searchTerm ?
    'No opportunities found matching your search.' :
    'No opportunities yet.'
    ) :

    currentItems.map((opportunity) => /*#__PURE__*/
    React.createElement("div", { key: opportunity.id, className: "table-row" }, /*#__PURE__*/

    React.createElement("div", { className: "cell" }, /*#__PURE__*/
    React.createElement("button", {
      className: "opportunity-name-button group",
      onClick: () => handleApplyClick(opportunity) }, /*#__PURE__*/

    React.createElement("span", { className: "opportunity-name" }, opportunity.title), /*#__PURE__*/
    React.createElement(FiChevronDown, { className: "opportunity-chevron" })
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "cell" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-container" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-bar match" }, /*#__PURE__*/
    React.createElement("div", {
      className: "progress-fill",
      style: {
        '--target-width': `${opportunity.matchPercentage}%`
      } }
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: "progress-text" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: opportunity.matchPercentage }), "%"
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "cell" }), /*#__PURE__*/

    React.createElement("div", { className: "cell" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-container" }, /*#__PURE__*/
    React.createElement("div", { className: "progress-bar application" }, /*#__PURE__*/
    React.createElement("div", {
      className: "progress-fill",
      style: {
        '--target-width': `${opportunity.applicationProgress}%`
      } }
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: "progress-text" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: opportunity.applicationProgress }), "%"
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "cell" }), /*#__PURE__*/

    React.createElement("div", { className: "cell deadline-cell" }, /*#__PURE__*/
    React.createElement(FiChevronDown, { className: "deadline-icon" }),
    formatDate(opportunity.deadline)
    ), /*#__PURE__*/

    React.createElement("div", { className: "cell" }, /*#__PURE__*/
    React.createElement("button", {
      className: "opportunity-action-link group",
      onClick: () => handleApplyClick(opportunity) }, /*#__PURE__*/

    React.createElement("span", null, "Apply Now"), /*#__PURE__*/
    React.createElement(FiChevronRight, { className: "action-chevron" })
    )
    )
    )
    )

    ), /*#__PURE__*/


    React.createElement("div", { className: "pagination" }, /*#__PURE__*/
    React.createElement("button", {
      onClick: handlePrevious,
      disabled: currentPage === 1,
      className: "pagination-btn" },
    "Previous"

    ), /*#__PURE__*/
    React.createElement("button", {
      onClick: handleNext,
      disabled: currentPage === totalPages,
      className: "pagination-btn" },
    "Next"

    )
    )
    ), /*#__PURE__*/


    React.createElement(SlidePanel, {
      isOpen: !!selectedOpportunity,
      onClose: () => setSelectedOpportunity(null),
      opportunity: selectedOpportunity },

    selectedOpportunity && /*#__PURE__*/
    React.createElement(OpportunityDetails, {
      opportunity: selectedOpportunity,
      onClose: () => setSelectedOpportunity(null) }
    )

    )
    ));

};

export default NewOpportunities;