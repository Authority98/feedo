/**
 * EmptyProfileSection Component
 * 
 * Features:
 * - Displays placeholder content when a section has no questions
 * - "Add Question" button integration
 * - Consistent styling with the rest of the application
 */

import React, { useState } from 'react';
import AdminButton from '../AdminButton/AdminButton';
import AddQuestionModal from '../Models/AddQuestionModal/AddQuestionModal';
import './EmptyProfileSection.css';

const EmptyProfileSection = ({ onAddClick, profileType, sectionId, sectionLabel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuestionTypeSelect = (questionType) => {
    onAddClick(questionType);
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "section-content" }, /*#__PURE__*/
    React.createElement("div", { className: "section-content-container" }, /*#__PURE__*/
    React.createElement("div", { className: "section-placeholder" }, /*#__PURE__*/
    React.createElement("p", null, "No questions added yet"), /*#__PURE__*/
    React.createElement("p", { className: "placeholder-details" }, "Start by adding questions to \"",
    sectionLabel, "\""
    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "primary",
      className: "mt-6",
      onClick: () => setIsModalOpen(true) },
    "Add New Question"

    )
    )
    ), /*#__PURE__*/
    React.createElement(AddQuestionModal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false),
      onSelectType: handleQuestionTypeSelect,
      profileType: profileType,
      sectionId: sectionId }
    )
    ));

};

export default EmptyProfileSection;