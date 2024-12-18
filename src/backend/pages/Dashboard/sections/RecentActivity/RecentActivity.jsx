/**
 * RecentActivity Component
 * 
 * A comprehensive activity tracking interface that provides:
 * - One recent item from each category
 * - Real-time activity feed from multiple sources
 * - Visual status indicators
 * - Interactive hover states
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSun, // For new opportunities
  FiFileText, // For submissions
  FiCheckCircle, // For approvals
  FiAlertTriangle, // For incomplete items
  FiUser, // For profile updates
  FiBook, // For education updates
  FiBriefcase, // For work experience
  FiShield, // For verification
  FiAlertCircle, // For follow-up
  FiArrowRight // For the view all button
} from 'react-icons/fi';
import './RecentActivity.css';
import { useAuth } from '../../../../../auth/AuthContext';
import { applicationOperations, opportunityOperations } from '../../../../../applications/applicationManager';
import SkeletonLoading from '../../../../../components/SkeletonLoading/SkeletonLoading';
import { db } from '../../../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import useProfileProgress from '../../../../../hooks/useProfileProgress';

const RecentActivity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sections, getMissingSteps } = useProfileProgress();

  // Helper function to get application status message
  const getApplicationStatusMessage = (application) => {
    switch (application.status) {
      case 'approved':
        return {
          prefix: 'Your application for ',
          name: application.name,
          suffix: ' was accepted'
        };
      case 'rejected':
        return {
          prefix: 'Your application for ',
          name: application.name,
          suffix: ' was rejected'
        };
      case 'pending':
        return {
          prefix: 'Your application for ',
          name: application.name,
          suffix: ' is under review'
        };
      case 'incomplete':
        return {
          prefix: 'Complete your application for ',
          name: application.name,
          suffix: ''
        };
      case 'follow-up':
        return {
          prefix: 'Follow-up required for ',
          name: application.name,
          suffix: ''
        };
      default:
        return {
          prefix: 'Applied to ',
          name: application.name,
          suffix: ''
        };
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.profile?.authUid) return;

      try {
        setLoading(true);

        // Get missing steps
        const missingStepsData = getMissingSteps();
        const missingStepActivities = missingStepsData.sections.length > 0 ? [{
          id: missingStepsData.sections.length > 1 ? 'missing-multiple' : `missing-${missingStepsData.sections[0].id}`,
          type: missingStepsData.sections.length > 1 ? 'Missing Steps' : 'Missing Step',
          icon: missingStepsData.sections.length > 1 ? FiAlertCircle : getSectionIcon(missingStepsData.sections[0].id),
          description: missingStepsData.message,
          date: new Date(),
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          link: `/data-management?tab=${missingStepsData.sections[0].id}`,
          targetTab: missingStepsData.sections[0].id
        }] : [];

        // Fetch both applications and opportunities
        const [applications, opportunities] = await Promise.all([
        applicationOperations.getUserApplications(user.profile.authUid),
        opportunityOperations.getOpportunities({ userId: user.profile.authUid })]
        );

        // Format submission notifications (using the most recent application)
        const submissionActivities = applications.length > 0 ? [{
          id: `submission-${applications[0].id}`,
          icon: FiFileText,
          description: {
            prefix: 'Submitted application for ',
            name: applications[0].name,
            suffix: ''
          },
          date: new Date(applications[0].submissionDate || applications[0].createdAt),
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          type: 'Submission',
          link: '/my-applications',
          applicationId: applications[0].id
        }] : [];

        // Format application notifications (using the second most recent application)
        const applicationActivities = applications.length > 1 ? [{
          id: `app-${applications[1].id}`,
          icon: getStatusIcon(applications[1].status),
          description: getApplicationStatusMessage(applications[1]),
          date: new Date(applications[1].submissionDate || applications[1].createdAt),
          color: getStatusColor(applications[1].status),
          bgColor: getStatusBgColor(applications[1].status),
          type: 'Application',
          link: '/my-applications',
          applicationId: applications[1].id
        }] : [];

        // Format opportunity notifications
        const opportunityActivities = opportunities.slice(0, 1).map((opp) => ({
          id: `opp-${opp.id}`,
          icon: FiSun,
          description: {
            prefix: 'New opportunity: ',
            name: opp.title,
            suffix: ''
          },
          date: new Date(opp.createdAt),
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          type: 'Opportunity',
          link: '/new-opportunities',
          opportunityId: opp.id
        }));

        // Combine all activities
        const allActivities = [
        ...missingStepActivities,
        ...submissionActivities,
        ...applicationActivities,
        ...opportunityActivities].
        sort((a, b) => b.date - a.date);

        setActivities(allActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, sections]);

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return FiCheckCircle;
      case 'rejected':
        return FiAlertTriangle;
      case 'pending':
        return FiFileText;
      case 'incomplete':
        return FiAlertTriangle;
      case 'follow-up':
        return FiAlertCircle;
      default:
        return FiFileText;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-blue-500';
      case 'incomplete':
        return 'text-orange-500';
      case 'follow-up':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      case 'pending':
        return 'bg-blue-50';
      case 'incomplete':
        return 'bg-orange-50';
      case 'follow-up':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  // Helper function to get status description
  const getStatusDescription = (status) => {
    switch (status) {
      case 'approved':
        return 'Application approved for';
      case 'rejected':
        return 'Application rejected for';
      case 'pending':
        return 'Application submitted to';
      default:
        return 'Applied to';
    }
  };

  // Add helper function to check section completion (same as DataSubmission)
  const checkSectionCompletion = (sectionId, user, questions) => {
    // If no user data or no profile sections, section is incomplete
    if (!user?.profileSections || !user.profileSections[sectionId]) {

      return false;
    }

    const sectionData = user.profileSections[sectionId];

    // If no questions array in section data, section is incomplete
    if (!sectionData.questions || !Array.isArray(sectionData.questions)) {

      return false;
    }

    // If no questions in config, section is incomplete
    if (!questions || !Array.isArray(questions) || questions.length === 0) {

      return false;
    }

    // Get required questions from config
    const requiredQuestions = questions.filter((q) => q.required);

    // For sections with no required questions, treat all questions as required
    // This ensures at least one question must be answered
    const questionsToCheck = requiredQuestions.length > 0 ? requiredQuestions : questions;

    // Check each question
    for (const question of questionsToCheck) {
      const questionData = sectionData.questions.find((q) => q.id === question.id);

      // If question data doesn't exist or has no answer, section is incomplete
      if (!questionData || !questionData.answer) {

        return false;
      }

      // For repeater type questions
      if (question.type === 'repeater' && question.repeaterFields) {
        // If answer is not an array or is empty, section is incomplete
        if (!Array.isArray(questionData.answer) || questionData.answer.length === 0) {

          return false;
        }

        // Check each repeater entry for fields
        const fieldsToCheck = question.repeaterFields.filter((field) => field.required || requiredQuestions.length === 0);
        for (const entry of questionData.answer) {
          for (const field of fieldsToCheck) {
            if (!entry || !entry[field.id] || entry[field.id] === '') {

              return false;
            }
          }
        }
      }
      // For non-repeater questions
      else {
        // Check for empty string, null, undefined, or empty array
        const isEmpty =
        questionData.answer === '' ||
        questionData.answer === null ||
        questionData.answer === undefined ||
        Array.isArray(questionData.answer) && (
        questionData.answer.length === 0 ||
        questionData.answer.every((a) => a === null || a === undefined || a === '')) ||

        question.type === 'phone' && (
        !questionData.answer ||
        typeof questionData.answer !== 'object' ||
        !questionData.answer.countryCode ||
        !questionData.answer.number ||
        !questionData.answer.number.trim());


        if (isEmpty) {

          return false;
        }
      }
    }

    // If we get here, all checked questions have valid answers

    return true;
  };

  // Helper function to format section name
  const formatSectionName = (sectionId) => {
    return sectionId.
    split('-').
    map((word) => word.charAt(0).toUpperCase() + word.slice(1)).
    join(' ');
  };

  // Helper function to get appropriate icon for each section
  const getSectionIcon = (sectionId) => {
    const iconMap = {
      'personal': FiUser,
      'education': FiBook,
      'work-experience': FiBriefcase,
      'verification': FiShield
      // Add more section mappings as needed
    };

    return iconMap[sectionId] || FiAlertCircle;
  };

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return '';

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `${hours} hours ago`;
    }

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Navigation handlers
  const handleViewApplications = (applicationId) => {
    navigate('/my-applications', { state: { openApplicationId: applicationId } });
  };
  const handleViewOpportunities = (opportunityId) => {
    navigate('/new-opportunities', { state: { openOpportunityId: opportunityId } });
  };
  const handleViewProfile = (activity) => {
    const tab = activity.targetTab || activity.link?.split('tab=')[1];
    navigate(`/data-management?tab=${tab}`);
  };

  // Get button config based on activity type
  const getViewButton = (activity) => {
    const Icon = FiArrowRight; // Default icon

    switch (activity.type) {
      case 'Application':
      case 'Submission':
        return {
          label: 'View',
          onClick: () => handleViewApplications(activity.applicationId),
          Icon
        };
      case 'Opportunity':
        return {
          label: 'View',
          onClick: () => handleViewOpportunities(activity.opportunityId),
          Icon
        };
      case 'Missing Step':
      case 'Missing Steps':
        return {
          label: 'Complete',
          onClick: () => handleViewProfile(activity),
          Icon
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "recent-activity" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-state" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-spinner" })
      )
      ));

  }

  if (error) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "recent-activity" }, /*#__PURE__*/
      React.createElement("div", { className: "activity-header" }, /*#__PURE__*/
      React.createElement("h2", { className: "activity-title" }, "Recent Activity")
      ), /*#__PURE__*/
      React.createElement("div", { className: "text-red-500 text-center py-4" },
      error
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "recent-activity" }, /*#__PURE__*/
    React.createElement("div", { className: "activity-header" }, /*#__PURE__*/
    React.createElement("h2", { className: "activity-title" }, "Recent Activity")
    ), /*#__PURE__*/

    React.createElement("div", { className: "activity-list" },
    activities.length > 0 ?
    activities.map((activity, index) => /*#__PURE__*/
    React.createElement("div", {
      key: activity.id,
      className: "activity-item",
      style: { animationDelay: `${index * 100}ms` } }, /*#__PURE__*/

    React.createElement("div", { className: `activity-icon-wrapper ${activity.bgColor}` }, /*#__PURE__*/
    React.createElement(activity.icon, { className: `activity-icon ${activity.color}` })
    ), /*#__PURE__*/

    React.createElement("div", { className: "activity-content" }, /*#__PURE__*/
    React.createElement("div", { className: "activity-main" }, /*#__PURE__*/
    React.createElement("span", { className: "activity-type" }, activity.type, ":"), /*#__PURE__*/
    React.createElement("span", { className: "activity-description" },
    typeof activity.description === 'string' ?
    activity.description : /*#__PURE__*/

    React.createElement(React.Fragment, null,
    activity.description.prefix, /*#__PURE__*/
    React.createElement("span", {
      className: "opportunity-name",
      onClick: () => {
        if (activity.type === 'Opportunity') {
          handleViewOpportunities(activity.opportunityId);
        } else if (activity.type === 'Application' || activity.type === 'Submission') {
          handleViewApplications(activity.applicationId);
        }
      } },

    activity.description.name
    ),
    activity.description.suffix
    )

    ),
    (activity.type === 'Application' || activity.type === 'Opportunity' || activity.type === 'Submission') && /*#__PURE__*/
    React.createElement("span", { className: "activity-date" }, formatDate(activity.date))

    ),
    getViewButton(activity) && /*#__PURE__*/
    React.createElement("button", {
      onClick: getViewButton(activity).onClick,
      className: "activity-view-btn" },

    getViewButton(activity).label, /*#__PURE__*/
    React.createElement(FiArrowRight, { className: "inline ml-1" })
    )

    )
    )
    ) : /*#__PURE__*/

    React.createElement("div", { className: "text-gray-500 text-center py-4" }, "No recent activities"

    )

    )
    ));

};

export default RecentActivity;