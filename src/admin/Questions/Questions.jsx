/**
 * Questions Management Component
 * 
 * Features:
 * - Profile type management
 * - Section configuration
 * - Question management per section
 */

import React, { useState, useEffect } from 'react';
import './Questions.css';
import CreateNewProfileTypeModel from '../AdminComponents/Models/CreateNewProfileTypeModel/CreateNewProfileTypeModel';
import ConfirmationModal from '../AdminComponents/Models/ConfirmationModal/ConfirmationModal';
import { adminQuestionsService } from '../../firebase/services/adminQuestions';
import { useToast } from '../../components/Toast/ToastContext';
import AdminButton from '../AdminComponents/AdminButton/AdminButton';
import QuestionTypeRouter from '../QuestionTypeRouter/QuestionTypeRouter';
import { FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { PROFILE_ICONS } from '../Icons/profileIcons';

const Questions = () => {
  const [profileTypes, setProfileTypes] = useState([]);
  const [selectedProfileType, setSelectedProfileType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfileType, setEditingProfileType] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    profileType: null
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadProfileTypes();
  }, []);

  const loadProfileTypes = async () => {
    try {
      const types = await adminQuestionsService.getProfileTypes();

      setProfileTypes(types);
    } catch (error) {
      console.error('Error loading profile types:', error);
      showToast('error', 'Failed to load profile types');
    }
  };

  const handleAddProfileType = async (profileTypeData) => {
    try {

      await adminQuestionsService.addProfileType(profileTypeData);
      showToast('success', 'Profile type added successfully');
      await loadProfileTypes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding profile type:', error);
      showToast('error', 'Failed to add profile type');
    }
  };

  const handleEditProfileType = async (profileTypeData) => {
    try {
      const result = await adminQuestionsService.updateProfileType(profileTypeData);

      if (result.changes.idChanged && selectedProfileType === result.changes.oldId) {
        setSelectedProfileType(result.changes.newId);
      }

      const message = `Profile type updated: 
        ${result.changes.newSections.length} new sections, 
        ${Object.keys(result.changes.mappings).length} sections mapped. 
        Questions preserved: ${result.changes.after.questionsCount}`;

      showToast('success', message);
      await loadProfileTypes();
      setIsModalOpen(false);
      setEditingProfileType(null);



    } catch (error) {
      console.error('Error updating profile type:', error);
      showToast('error', 'Failed to update profile type');
    }
  };

  const handleDeleteClick = (profileType) => {
    setDeleteConfirmation({
      isOpen: true,
      profileType: profileType
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminQuestionsService.deleteProfileType(deleteConfirmation.profileType.id);
      showToast('success', 'Profile type deleted successfully');
      if (selectedProfileType === deleteConfirmation.profileType.id) {
        setSelectedProfileType('');
      }
      await loadProfileTypes();
    } catch (error) {
      console.error('Error deleting profile type:', error);
      showToast('error', 'Failed to delete profile type');
    } finally {
      setDeleteConfirmation({ isOpen: false, profileType: null });
    }
  };

  const getSelectedProfileSections = () => {
    const selectedProfile = profileTypes.find((t) => t.id === selectedProfileType);
    if (!selectedProfile?.sections) return [];

    return Object.entries(selectedProfile.sections).map(([id, section]) => ({
      id,
      ...section
    }));
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "questions-container" }, /*#__PURE__*/
    React.createElement("div", { className: "page-header" }, /*#__PURE__*/
    React.createElement("h1", null, "Profile Questions Management"), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "primary",
      onClick: () => setIsModalOpen(true),
      className: "add-profile-button" }, /*#__PURE__*/

    React.createElement(FiPlus, null), " Add Profile Type"
    )
    ),

    profileTypes.length === 0 ? /*#__PURE__*/
    React.createElement("div", { className: "empty-profile-types" }, /*#__PURE__*/
    React.createElement("div", { className: "empty-content" }, /*#__PURE__*/
    React.createElement("div", { className: "empty-icon" }, "\uD83D\uDCDD"), /*#__PURE__*/
    React.createElement("h2", null, "No Profile Types Added"), /*#__PURE__*/
    React.createElement("p", null, "Get started by adding your first profile type."), /*#__PURE__*/
    React.createElement("p", { className: "empty-details" }, "Profile types help organize different sets of questions for various user categories."

    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "primary",
      onClick: () => setIsModalOpen(true),
      className: "mt-6" }, /*#__PURE__*/

    React.createElement(FiPlus, null), " Add Profile Type"
    )
    )
    ) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "profile-type-selector" }, /*#__PURE__*/
    React.createElement("h2", null, "Select Profile Type"), /*#__PURE__*/
    React.createElement("div", { className: "profile-type-buttons" },
    profileTypes.map((type) => /*#__PURE__*/
    React.createElement("div", { key: type.id, className: "profile-type-wrapper" }, /*#__PURE__*/
    React.createElement(AdminButton, {
      variant: "outline",
      className: `profile-type-btn ${selectedProfileType === type.id ? 'active' : ''}`,
      onClick: () => setSelectedProfileType(type.id) },

    (() => {
      const IconComponent = PROFILE_ICONS.find((icon) => icon.id === type.icon)?.icon || FiUser;
      return (/*#__PURE__*/
        React.createElement(React.Fragment, null, /*#__PURE__*/
        React.createElement(IconComponent, { className: "profile-type-icon" }),
        type.label
        ));

    })()
    ), /*#__PURE__*/
    React.createElement("div", { className: "profile-type-actions" }, /*#__PURE__*/
    React.createElement(FiEdit2, {
      className: "action-icon edit",
      onClick: (e) => {
        e.stopPropagation();
        setEditingProfileType(type);
        setIsModalOpen(true);
      },
      title: "Edit profile type" }
    ), /*#__PURE__*/
    React.createElement(FiTrash2, {
      className: "action-icon delete",
      onClick: (e) => {
        e.stopPropagation();
        handleDeleteClick(type);
      },
      title: "Delete profile type" }
    )
    )
    )
    )
    )
    ),

    selectedProfileType && /*#__PURE__*/
    React.createElement("div", { className: "questions-content" }, /*#__PURE__*/
    React.createElement(QuestionTypeRouter, {
      profileType: selectedProfileType,
      sections: getSelectedProfileSections() }
    )
    )

    ), /*#__PURE__*/


    React.createElement(CreateNewProfileTypeModel, {
      isOpen: isModalOpen,
      onClose: () => {
        setIsModalOpen(false);
        setEditingProfileType(null);
      },
      onSave: editingProfileType ? handleEditProfileType : handleAddProfileType,
      initialData: editingProfileType }
    ), /*#__PURE__*/

    React.createElement(ConfirmationModal, {
      isOpen: deleteConfirmation.isOpen,
      onClose: () => setDeleteConfirmation({ isOpen: false, profileType: null }),
      onConfirm: handleDeleteConfirm,
      title: "Delete Profile Type",
      message:
      deleteConfirmation.profileType ?
      `Are you sure you want to delete "${deleteConfirmation.profileType.label}"? This will delete all sections and questions within this profile type.` :
      '',

      confirmText: "Delete",
      cancelText: "Cancel" }
    )
    ));

};

export default Questions;