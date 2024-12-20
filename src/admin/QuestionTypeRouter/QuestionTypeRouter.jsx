/**
 * QuestionTypeRouter Component
 * 
 * Features:
 * - Section-based question management
 * - Real-time Firebase integration
 * - Drag and drop reordering
 * - Error handling and loading states
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/Toast/ToastContext';
import { adminQuestionsService } from '../../firebase/services/adminQuestions';
import QuestionsList from '../AdminComponents/QuestionList/QuestionsList';
import EmptyProfileSection from '../AdminComponents/EmptyProfileSection/EmptyProfileSection';
import ProfileSectionContainer from '../AdminComponents/ProfileSectionContainer/ProfileSectionContainer';
import './QuestionTypeRouter.css';

const QuestionTypeRouter = ({ profileType, sections }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Set initial active section when sections are loaded
  useEffect(() => {
    if (sections?.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections]);

  // Load questions for the current section from Firebase
  useEffect(() => {
    const loadQuestions = async () => {
      if (!profileType || !activeSection) return;

      try {
        setLoading(true);
        setError(null);

        const fetchedQuestions = await adminQuestionsService.getQuestions(profileType, activeSection);
        setQuestions(fetchedQuestions || []);
      } catch (error) {
        console.error('Error details:', error);
        setError('Failed to load questions. Please try again.');
        showToast('error', 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [profileType, activeSection, showToast]);

  const handleAddQuestion = async (questionData) => {
    try {
      setLoading(true);

      await adminQuestionsService.addQuestion(
        profileType,
        activeSection,
        questionData
      );

      // Refresh questions after adding
      const updatedQuestions = await adminQuestionsService.getQuestions(profileType, activeSection);
      setQuestions(updatedQuestions);
      showToast('success', 'Question added successfully');

      return true;
    } catch (error) {
      console.error('Error adding question:', error);
      showToast('error', 'Failed to add question');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = async (questionId, updatedData) => {
    try {
      await adminQuestionsService.updateQuestion(
        profileType,
        activeSection,
        questionId,
        updatedData
      );

      // Refresh questions after updating
      const updatedQuestions = await adminQuestionsService.getQuestions(profileType, activeSection);
      setQuestions(updatedQuestions);
      showToast('success', 'Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      showToast('error', 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await adminQuestionsService.deleteQuestion(profileType, activeSection, questionId);

      // Refresh questions after deleting
      const updatedQuestions = await adminQuestionsService.getQuestions(profileType, activeSection);
      setQuestions(updatedQuestions);
      showToast('success', 'Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast('error', 'Failed to delete question');
    }
  };

  const handleReorder = async (dragIndex, dropIndex) => {
    const reorderedQuestions = [...questions];
    const [draggedQuestion] = reorderedQuestions.splice(dragIndex, 1);
    reorderedQuestions.splice(dropIndex, 0, draggedQuestion);

    try {
      await adminQuestionsService.reorderQuestions(
        profileType,
        activeSection,
        reorderedQuestions
      );

      setQuestions(reorderedQuestions);
      showToast('success', 'Questions reordered successfully');
    } catch (error) {
      console.error('Error reordering questions:', error);
      showToast('error', 'Failed to reorder questions');
    }
  };

  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return (/*#__PURE__*/
      React.createElement("div", { className: "empty-state" }, /*#__PURE__*/
      React.createElement("p", null, "No profile sections configured for this profile type.")
      ));

  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "questions-router" }, /*#__PURE__*/
    React.createElement(ProfileSectionContainer, {
      sections: sections,
      activeSection: activeSection,
      onSectionChange: setActiveSection }
    ), /*#__PURE__*/

    React.createElement("div", { className: "section-content" },
    loading ? /*#__PURE__*/
    React.createElement("div", { className: "loading-container" }, /*#__PURE__*/
    React.createElement("p", null, "Loading questions...")
    ) :
    error ? /*#__PURE__*/
    React.createElement("div", { className: "error-container" }, /*#__PURE__*/
    React.createElement("p", { className: "error-message" }, error), /*#__PURE__*/
    React.createElement("button", {
      className: "retry-button",
      onClick: () => window.location.reload() },
    "Retry"

    )
    ) :
    questions.length > 0 ? /*#__PURE__*/
    React.createElement(QuestionsList, {
      questions: questions,
      onAdd: handleAddQuestion,
      onEdit: handleEditQuestion,
      onDelete: handleDeleteQuestion,
      onReorder: handleReorder,
      profileType: profileType,
      sectionId: activeSection,
      sectionLabel: sections.find((s) => s.id === activeSection)?.label }
    ) : /*#__PURE__*/

    React.createElement(EmptyProfileSection, {
      onAddClick: handleAddQuestion,
      profileType: profileType,
      sectionId: activeSection,
      sectionLabel: sections.find((s) => s.id === activeSection)?.label }
    )

    )
    ));

};

export default QuestionTypeRouter;