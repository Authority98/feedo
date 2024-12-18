/**
 * QuestionsList Component
 * 
 * Features:
 * - Displays list of questions
 * - Handles question reordering with visual feedback
 * - Question edit/delete actions
 * - Consistent question card styling
 * - Loading states and animations
 */

import React, { useState, useRef } from 'react';
import AdminButton from '../AdminButton/AdminButton';
import Button from '../../../components/Button/Button';
import AddQuestionModal from '../Models/AddQuestionModal/AddQuestionModal';
import ConfirmationModal from '../Models/ConfirmationModal/ConfirmationModal';
import './QuestionsList.css';

const QuestionsList = ({ questions, onAdd, onEdit, onDelete, onReorder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const draggedOverItem = useRef(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    questionId: null,
    questionTitle: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  // Question type icons mapping
  const typeIcons = {
    text: '✍️',
    textarea: '📝',
    singleChoice: '⭕',
    multipleChoice: '☑️',
    dropdown: '▼',
    date: '📅',
    file: '📎',
    repeater: '🔄'
  };

  const handleQuestionTypeSelect = (questionData) => {
    if (editingQuestion) {
      onEdit(editingQuestion.id, questionData);
    } else {
      onAdd(questionData);
    }
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (question) => {
    setDeleteConfirmation({
      isOpen: true,
      questionId: question.id,
      questionTitle: question.question
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.questionId) {
      onDelete(deleteConfirmation.questionId);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    setIsDragging(true);
    e.currentTarget.classList.add('dragging');
    // Set drag preview image
    const dragPreview = e.currentTarget.cloneNode(true);
    dragPreview.style.opacity = '0.5';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragEnter = (e, index) => {
    draggedOverItem.current = index;
    const cards = document.querySelectorAll('.question-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('drag-over');
      } else {
        card.classList.remove('drag-over');
      }
    });
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('dragging');
    if (draggedItem !== null && draggedOverItem.current !== null) {
      onReorder(draggedItem, draggedOverItem.current);
    }
    setDraggedItem(null);
    draggedOverItem.current = null;
    // Clean up all drag-related classes
    document.querySelectorAll('.question-card').forEach((card) => {
      card.classList.remove('drag-over', 'dragging');
    });
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "questions-list-container" }, /*#__PURE__*/
    React.createElement("div", { className: "questions-header" }, /*#__PURE__*/
    React.createElement("div", { className: "header-content" }, /*#__PURE__*/
    React.createElement("h3", null, "Questions"), /*#__PURE__*/
    React.createElement("span", { className: "question-count" },
    questions.length, " ", questions.length === 1 ? 'Question' : 'Questions'
    )
    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "primary",
      className: "min-w-[180px] ml-6",
      onClick: () => setIsModalOpen(true) },
    "Add New Question"

    )
    ), /*#__PURE__*/

    React.createElement("div", { className: `questions-grid ${isDragging ? 'is-dragging' : ''}` },
    questions.map((question, index) => /*#__PURE__*/
    React.createElement("div", {
      key: question.id,
      className: "question-card",
      draggable: true,
      onDragStart: (e) => handleDragStart(e, index),
      onDragEnter: (e) => handleDragEnter(e, index),
      onDragEnd: handleDragEnd,
      onDragOver: (e) => e.preventDefault() }, /*#__PURE__*/

    React.createElement("div", { className: "question-content" }, /*#__PURE__*/
    React.createElement("span", { className: "question-number" }, index + 1), /*#__PURE__*/
    React.createElement("div", { className: "drag-handle", title: "Drag to reorder" }, "\u22EE\u22EE"), /*#__PURE__*/
    React.createElement("div", { className: "question-details" }, /*#__PURE__*/
    React.createElement("div", { className: "question-header" }, /*#__PURE__*/
    React.createElement("span", { className: "question-type-icon" },
    typeIcons[question.type]
    ), /*#__PURE__*/
    React.createElement("h4", null, question.question)
    ), /*#__PURE__*/
    React.createElement("p", { className: "question-type" },
    question.type === 'repeater' ? 'Group' :
    question.type.charAt(0).toUpperCase() + question.type.slice(1)
    ),
    question.description && /*#__PURE__*/
    React.createElement("p", { className: "question-description" }, question.description), /*#__PURE__*/

    React.createElement("div", { className: "question-badges" },
    question.required && /*#__PURE__*/
    React.createElement("span", { className: "required-badge" }, "Required"),

    question.validation?.minLength > 0 && /*#__PURE__*/
    React.createElement("span", { className: "validation-badge" }, "Min: ",
    question.validation.minLength
    ),

    question.validation?.maxLength < 1000 && /*#__PURE__*/
    React.createElement("span", { className: "validation-badge" }, "Max: ",
    question.validation.maxLength
    )

    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "question-actions" }, /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "outline",
      className: "min-w-[100px]",
      onClick: () => handleEdit(question) },
    "Edit"

    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "danger",
      className: "min-w-[100px]",
      onClick: () => handleDeleteClick(question) },
    "Delete"

    )
    )
    )
    )
    ), /*#__PURE__*/

    React.createElement(AddQuestionModal, {
      isOpen: isModalOpen,
      onClose: () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
      },
      onSelectType: handleQuestionTypeSelect,
      editingQuestion: editingQuestion }
    ), /*#__PURE__*/

    React.createElement(ConfirmationModal, {
      isOpen: deleteConfirmation.isOpen,
      onClose: () => setDeleteConfirmation({ isOpen: false, questionId: null, questionTitle: '' }),
      onConfirm: handleDeleteConfirm,
      title: "Delete Question",
      message: `Are you sure you want to delete the question "${deleteConfirmation.questionTitle}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel" }
    )
    ));

};

export default QuestionsList;