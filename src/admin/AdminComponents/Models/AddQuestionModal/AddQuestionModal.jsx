/**
 * AddQuestionModal Component
 * 
 * Features:
 * - Modal for adding/editing questions
 * - Question type selection
 * - Form integration
 */

import React, { useState } from 'react';
import AdminButton from '../../AdminButton/AdminButton';
import QuestionForm from '../../QuestionForm/QuestionForm';
import './AddQuestionModal.css';

const AddQuestionModal = ({
  isOpen,
  onClose,
  onSelectType,
  editingQuestion,
  profileType,
  sectionId
}) => {
  const [selectedType, setSelectedType] = useState(editingQuestion?.type || null);

  const questionTypes = [
  {
    id: 'repeater',
    label: 'Group Field',
    description: 'Add multiple sets of related fields',
    icon: '🔄'
  },
  {
    id: 'text',
    label: 'Text Input',
    description: 'Single line or paragraph text response',
    icon: '✍️'
  },
  {
    id: 'multipleChoice',
    label: 'Multiple Choice',
    description: 'Select multiple options from choices',
    icon: '☑️'
  },
  {
    id: 'dropdown',
    label: 'Dropdown',
    description: 'Select from a dropdown list',
    icon: '▼'
  },
  {
    id: 'file',
    label: 'File Upload',
    description: 'Upload documents or images',
    icon: '📎'
  },
  {
    id: 'date',
    label: 'Date',
    description: 'Date picker input',
    icon: '📅'
  },
  {
    id: 'phone',
    label: 'Phone Number',
    description: 'Phone number with country code',
    icon: '📱'
  }];


  // Get the display name for the question type
  const getQuestionTypeDisplay = (type) => {
    switch (type) {
      case 'repeater':
        return 'Group';
      case 'multipleChoice':
        return 'Multiple Choice';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "modal-overlay" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-content" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-header" }, /*#__PURE__*/
    React.createElement("h2", null,
    editingQuestion ?
    `Edit ${getQuestionTypeDisplay(editingQuestion.type)} Question` :
    'Add New Question'

    ), /*#__PURE__*/
    React.createElement("button", { className: "close-button", onClick: onClose }, "\xD7")
    ), /*#__PURE__*/

    React.createElement("div", { className: "modal-form-container" },
    !selectedType && !editingQuestion ? /*#__PURE__*/
    React.createElement("div", { className: "question-types-grid" },
    questionTypes.map((type) => /*#__PURE__*/
    React.createElement("button", {
      key: type.id,
      className: "question-type-card",
      onClick: () => setSelectedType(type.id) }, /*#__PURE__*/

    React.createElement("span", { className: "question-type-icon" }, type.icon), /*#__PURE__*/
    React.createElement("h3", null, type.label), /*#__PURE__*/
    React.createElement("p", null, type.description)
    )
    )
    ) : /*#__PURE__*/

    React.createElement(QuestionForm, {
      questionType: selectedType || editingQuestion?.type,
      onSubmit: onSelectType,
      onCancel: () => {
        if (editingQuestion) {
          onClose();
        } else {
          setSelectedType(null);
        }
      },
      initialData: editingQuestion,
      profileType: profileType,
      sectionId: sectionId }
    )

    )
    )
    ));

};

export default AddQuestionModal;