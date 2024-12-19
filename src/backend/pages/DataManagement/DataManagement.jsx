/**
 * DataManagement Component
 * Features:
 * - Dynamic sections based on user's profile type
 * - Questions from admin configuration
 * - Progress tracking
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import DataSubmission from '../Dashboard/sections/DataSubmission/DataSubmission';
import './DataManagement.css';
import SectionForm from './SectionForm/SectionForm';
import { eventEmitter, EVENTS } from '../../../services/eventEmitter';
import { FiCheckCircle, FiAlertCircle, FiHelpCircle, FiMessageCircle } from 'react-icons/fi';
import { useProfileProgress } from '../../../hooks/useProfileProgress';
import { Tabs, Tab, Box, useTheme, Button, Tooltip, Zoom } from '@mui/material';
import QuestionDialog from '../../../components/QuestionDialog/QuestionDialog';

const DataManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || '');
  const { submissionItems } = useProfileProgress();
  const theme = useTheme();
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);

  // Fetch sections data
  const fetchSections = async () => {
    try {
      setLoading(true);
      if (!user?.profile?.userType) {
        setSections([]);
        setLoading(false);
        return;
      }

      const profilesDocRef = doc(db, 'admin', 'profiles');
      const profilesDoc = await getDoc(profilesDocRef);

      if (!profilesDoc.exists()) {
        setSections([]);
        setLoading(false);
        return;
      }

      const data = profilesDoc.data();
      const userProfileType = data.profileTypes[user.profile.userType];

      if (!userProfileType?.sections) {
        setSections([]);
        setLoading(false);
        return;
      }

      const sectionsArray = Object.entries(userProfileType.sections).map(([id, section]) => ({
        id,
        ...section
      }));

      setSections(sectionsArray);

      // Set initial active tab if not set
      if (!activeTab && sectionsArray.length > 0) {
        setActiveTab(sectionsArray[0].id);
        setSearchParams({ tab: sectionsArray[0].id });
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load sections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSections();
  }, [user?.profile?.userType]);

  // Listen for section updates
  useEffect(() => {
    const unsubscribe = eventEmitter.on(EVENTS.SECTION_DATA_UPDATED, () => {

      fetchSections();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update URL when tab changes
  const handleTabChange = (event, newValue) => {
    if (newValue !== activeTab) {  // Only update if the tab actually changed
      setActiveTab(newValue);
      setSearchParams({ tab: newValue });
    }
  };

  // Listen for URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab && sections.some(section => section.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, sections]);

  // Render appropriate content based on active tab
  const renderTabContent = () => {
    const activeSection = sections.find((section) => section.id === activeTab);
    if (!activeSection || !user) {

      return null;
    }

    // Get the saved form data from user's profile sections
    const savedFormData = {};
    const sectionData = user?.profileSections?.[activeSection.id];




    // Initialize form data with default values for all questions
    if (activeSection.questions) {
      activeSection.questions.forEach((question) => {
        if (!question || !question.id) {

          return;
        }

        try {
          if (question.type === 'repeater') {
            // Initialize repeater fields with at least one empty group
            const repeaterData = [];
            const existingData = sectionData?.questions?.find((q) => q.id === question.id)?.answer;

            if (Array.isArray(existingData) && existingData.length > 0) {
              // Map existing data and ensure all required fields exist
              repeaterData.push(...existingData.map((group) => ({
                ...Object.fromEntries(
                  (question.repeaterFields || []).map((field) => [
                  field.id,
                  field.type === 'multipleChoice' ? [] : '']
                  )
                ),
                ...group
              })));
            } else {
              // Create one empty group with all fields initialized
              repeaterData.push(
                Object.fromEntries(
                  (question.repeaterFields || []).map((field) => [
                  field.id,
                  field.type === 'multipleChoice' ? [] : '']
                  )
                )
              );
            }
            savedFormData[question.id] = repeaterData;
          } else if (question.type === 'multipleChoice') {
            const answer = sectionData?.questions?.find((q) => q.id === question.id)?.answer;
            savedFormData[question.id] = Array.isArray(answer) ? answer : [];
          } else if (question.type === 'file') {
            savedFormData[question.id] = sectionData?.questions?.find((q) => q.id === question.id)?.answer || null;
          } else {
            savedFormData[question.id] = sectionData?.questions?.find((q) => q.id === question.id)?.answer || '';
          }
        } catch (error) {
          console.error('Error initializing question:', question.id, error);
          // Initialize with a safe default value based on question type
          savedFormData[question.id] = question.type === 'multipleChoice' ? [] : '';
        }
      });
    }



    return (/*#__PURE__*/
      React.createElement("div", { className: "tab-pane" }, /*#__PURE__*/
      React.createElement(SectionForm, {
        section: activeSection,
        profileType: user.userType,
        formData: savedFormData }
      )
      ));

  };

  if (loading && !sections.length) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "data-management" }, /*#__PURE__*/
      React.createElement("main", { className: "main-content" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-state" }, /*#__PURE__*/
      React.createElement("div", { className: "loading-spinner" })
      )
      ), /*#__PURE__*/
      React.createElement(DataSubmission, null)
      ));

  }

  if (error) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "data-management" }, /*#__PURE__*/
      React.createElement("div", { className: "error-state" }, /*#__PURE__*/
      React.createElement("p", null, error), /*#__PURE__*/
      React.createElement("button", { onClick: () => window.location.reload() }, "Retry")
      )
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "data-management" }, /*#__PURE__*/
    React.createElement("main", { className: "main-content" }, /*#__PURE__*/
    React.createElement(Box, { sx: {
        width: '100%',
        bgcolor: 'background.paper',
        mb: 2,
        borderRadius: 1,
        overflow: 'hidden'
      } }, /*#__PURE__*/
    React.createElement(Box, { sx: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        gap: 2
      } }, /*#__PURE__*/
    React.createElement(Tabs, {
      value: activeTab,
      onChange: handleTabChange,
      variant: "scrollable",
      scrollButtons: "auto",
      "aria-label": "data management tabs",
      sx: {
        flex: 1,
        '& .MuiTab-root': {
          textTransform: 'none',
          minHeight: '48px',
          fontWeight: 500
        }
      } },

    sections.map((section) => {
      const submissionItem = submissionItems.find((item) => item.id === section.id);
      const isComplete = submissionItem?.status === 'complete';

      return (/*#__PURE__*/
        React.createElement(Tab, {
          key: section.id,
          label: /*#__PURE__*/
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 } },
          section.label,
          isComplete ? /*#__PURE__*/
          React.createElement(FiCheckCircle, { style: { color: theme.palette.primary.main } }) : /*#__PURE__*/

          React.createElement(FiAlertCircle, { style: { color: theme.palette.primary.main } })

          ),

          value: section.id,
          sx: {
            '&.Mui-selected': {
              color: 'primary.main'
            }
          } }
        ));

    })
    ), /*#__PURE__*/


    React.createElement(Tooltip, {
      title: "Add a question about this section",
      placement: "left",
      arrow: true }, /*#__PURE__*/

    React.createElement(Button, {
      variant: "text",
      onClick: () => setOpenQuestionDialog(true),
      startIcon: /*#__PURE__*/React.createElement(FiMessageCircle, null),
      sx: {
        mr: 2,
        color: 'text.secondary',
        '&:hover': {
          color: 'primary.main',
          bgcolor: 'action.hover'
        },
        transition: 'all 0.2s ease',
        textTransform: 'none',
        fontWeight: 500,
        minWidth: 'auto',
        px: 2,
        height: '36px',
        borderRadius: '18px',
        fontSize: '0.875rem',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover .question-text': {
          maxWidth: '200px',
          marginLeft: '8px',
          opacity: 1
        }
      } }, /*#__PURE__*/

    React.createElement(Box, { component: "span", sx: {
        maxWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        opacity: 0,
        transition: 'all 0.3s ease'
      }, className: "question-text" }, "Add a Question"

    )
    )
    )
    )
    ),
    renderTabContent(), /*#__PURE__*/


    React.createElement(QuestionDialog, {
      open: openQuestionDialog,
      onClose: () => setOpenQuestionDialog(false),
      currentSection: sections.find((section) => section.id === activeTab) }
    )
    ), /*#__PURE__*/
    React.createElement(DataSubmission, null)
    ));

};

export default DataManagement;