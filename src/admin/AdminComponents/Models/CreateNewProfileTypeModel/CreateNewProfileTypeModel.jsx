/**
 * SectionModal Component
 * 
 * Features:
 * - Add/Edit profile types and sections
 * - Auto-generated IDs from labels
 * - Organized section management per profile type
 */

import React, { useState, useEffect } from 'react';
import AdminButton from '../../AdminButton/AdminButton';
import { FiX, FiPlus, FiUser, FiList, FiAlertCircle, FiTrash2, FiSearch } from 'react-icons/fi';
import './CreateNewProfileTypeModel.css';
import { PROFILE_ICONS } from '../../../Icons/profileIcons';

const SectionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    label: '',
    subtitle: '',
    icon: '',
    sections: [{ label: '' }]
  });

  const [sectionMappings, setSectionMappings] = useState(new Map());
  const [iconSearch, setIconSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Convert sections object to array if needed
        const sectionsArray = initialData.sections ?
        Object.entries(initialData.sections).map(([id, section]) => ({
          id,
          label: section.label,
          originalId: id // Keep track of original ID
        })) :
        [{ label: '' }];

        setFormData({
          label: initialData.label,
          subtitle: initialData.subtitle || '',
          icon: initialData.icon || '',
          sections: sectionsArray
        });

        // Initialize mappings for existing sections
        const initialMappings = new Map();
        sectionsArray.forEach((section) => {
          if (section.originalId) {
            initialMappings.set(section.originalId, section.originalId);
          }
        });
        setSectionMappings(initialMappings);
      } else {
        setFormData({
          label: '',
          subtitle: '',
          icon: '',
          sections: [{ label: '' }]
        });
        setSectionMappings(new Map());
      }
    }
  }, [isOpen, initialData]);

  // Function to generate ID from label
  const generateId = (label) => {
    return label.
    toLowerCase().
    replace(/[^a-z0-9\s-]/g, '').
    replace(/\s+/g, '-').
    replace(/-+/g, '-').
    trim();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Profile type label is required';
    }

    // Validate sections
    const sectionErrors = [];
    const sectionLabels = new Set();

    formData.sections.forEach((section, index) => {
      const sectionError = {};

      if (!section.label.trim()) {
        sectionError.label = 'Section label is required';
      } else if (sectionLabels.has(section.label.toLowerCase())) {
        sectionError.label = 'Section labels must be unique';
      }

      if (Object.keys(sectionError).length > 0) {
        sectionErrors[index] = sectionError;
      }

      sectionLabels.add(section.label.toLowerCase());
    });

    if (sectionErrors.length > 0) {
      newErrors.sections = sectionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const profileTypeId = initialData?.id || generateId(formData.label);

      // Convert sections array to object with proper mappings
      const sectionsObject = {};
      formData.sections.forEach((section) => {
        const sectionId = section.id || generateId(section.label);
        sectionsObject[sectionId] = {
          id: sectionId,
          label: section.label,
          questions: [],
          updatedAt: new Date().toISOString()
        };
      });

      // Create the section mappings object
      const mappingsObject = {};
      sectionMappings.forEach((newId, oldId) => {
        if (oldId !== newId) {// Only include changed mappings
          mappingsObject[oldId] = newId;
        }
      });

      const profileTypeData = {
        id: profileTypeId,
        label: formData.label,
        subtitle: formData.subtitle,
        icon: formData.icon,
        sections: sectionsObject,
        _sectionMappings: mappingsObject, // Add mappings to the data
        metadata: {
          createdAt: initialData?.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: initialData?.metadata?.version || 1
        }
      };


      onSave(profileTypeData);
    }
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { label: '' }]
    });
  };

  const handleRemoveSection = (index) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  const handleSectionChange = (index, value) => {
    const newSections = [...formData.sections];
    const section = newSections[index];
    const oldId = section.id || generateId(section.label);
    const newId = generateId(value);

    newSections[index] = {
      ...section,
      label: value,
      id: newId
    };

    // Update mappings if this was an existing section
    if (section.originalId) {
      setSectionMappings((prevMappings) => {
        const newMappings = new Map(prevMappings);
        newMappings.set(section.originalId, newId);
        return newMappings;
      });
    }

    setFormData({ ...formData, sections: newSections });

    // Clear errors for the changed field
    if (errors.sections?.[index]?.label) {
      const newErrors = { ...errors };
      if (newErrors.sections) {
        delete newErrors.sections[index];
        if (Object.keys(newErrors.sections).length === 0) {
          delete newErrors.sections;
        }
      }
      setErrors(newErrors);
    }
  };

  const handleIconSelect = (iconId) => {
    setFormData({ ...formData, icon: iconId });
  };

  const filteredIcons = iconSearch.trim() ?
  PROFILE_ICONS.filter((icon) =>
  icon.label.toLowerCase().includes(iconSearch.toLowerCase())
  ) :
  [];

  if (!isOpen) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "modal-overlay" }, /*#__PURE__*/
    React.createElement("div", { className: "section-modal" }, /*#__PURE__*/
    React.createElement("div", { className: "modal-header" }, /*#__PURE__*/
    React.createElement("h2", null, initialData ? 'Edit Profile Type' : 'Create New Profile Type'), /*#__PURE__*/
    React.createElement("button", { className: "close-button", onClick: onClose }, /*#__PURE__*/
    React.createElement(FiX, null)
    )
    ), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit, className: "section-modal-form" }, /*#__PURE__*/
    React.createElement("div", { className: "form-section" }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Profile Type Name"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      value: formData.label,
      onChange: (e) => {
        setFormData({ ...formData, label: e.target.value });
        if (errors.label) {
          setErrors({ ...errors, label: null });
        }
      },
      placeholder: "e.g., Student, Entrepreneur, Company",
      className: errors.label ? 'error' : '' }
    ),
    errors.label && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null),
    errors.label
    ), /*#__PURE__*/

    React.createElement("p", { className: "helper-text" }, "Choose a name that identifies this type of profile (e.g., Student Profile, Company Profile)."

    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Profile Type Subtitle ", /*#__PURE__*/React.createElement("span", { className: "optional-text" }, "(Optional)")), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      value: formData.subtitle,
      onChange: (e) => setFormData({ ...formData, subtitle: e.target.value }),
      placeholder: "e.g., Create a profile for students and graduates",
      className: "form-input" }
    ), /*#__PURE__*/
    React.createElement("p", { className: "helper-text" }, "Add a brief description to explain the purpose of this profile type."

    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group mt-4" }, /*#__PURE__*/
    React.createElement("label", null, "Profile Type Icon"), /*#__PURE__*/
    React.createElement("div", { className: "icon-search-container" }, /*#__PURE__*/
    React.createElement("div", { className: "search-input-wrapper" }, /*#__PURE__*/
    React.createElement(FiSearch, { className: "search-icon" }), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Search icons (e.g., user, business, education)...",
      value: iconSearch,
      onChange: (e) => {
        setIconSearch(e.target.value);
        setIsSearching(true);
      },
      className: "icon-search-input" }
    ),
    iconSearch && /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      onClick: () => {
        setIconSearch('');
        setIsSearching(false);
      },
      className: "clear-search" }, /*#__PURE__*/

    React.createElement(FiX, null)
    )

    ),

    !isSearching && formData.icon && /*#__PURE__*/
    React.createElement("div", { className: "selected-icon-display" },
    (() => {
      const IconComponent = PROFILE_ICONS.find((i) => i.id === formData.icon)?.icon;
      return IconComponent && /*#__PURE__*/
      React.createElement(React.Fragment, null, /*#__PURE__*/
      React.createElement(IconComponent, { className: "current-icon" }), /*#__PURE__*/
      React.createElement("span", { className: "icon-label" },
      PROFILE_ICONS.find((i) => i.id === formData.icon)?.label
      )
      );

    })()
    ),


    isSearching && /*#__PURE__*/
    React.createElement("div", { className: "icon-search-results" },
    filteredIcons.length > 0 ? /*#__PURE__*/
    React.createElement("div", { className: "icon-grid" },
    filteredIcons.map((iconOption) => {
      const IconComponent = iconOption.icon;
      return (/*#__PURE__*/
        React.createElement("button", {
          key: iconOption.id,
          type: "button",
          className: `icon-option ${formData.icon === iconOption.id ? 'selected' : ''}`,
          onClick: () => {
            handleIconSelect(iconOption.id);
            setIconSearch('');
            setIsSearching(false);
          },
          title: iconOption.label }, /*#__PURE__*/

        React.createElement(IconComponent, { className: "icon" }), /*#__PURE__*/
        React.createElement("span", { className: "icon-label" }, iconOption.label)
        ));

    })
    ) : /*#__PURE__*/

    React.createElement("div", { className: "no-results" }, "No icons found matching \"",
    iconSearch, "\""
    )

    )

    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-section" }, /*#__PURE__*/
    React.createElement("div", { className: "section-header" }, /*#__PURE__*/
    React.createElement("h3", null, /*#__PURE__*/
    React.createElement(FiList, { className: "text-xl" }), "Profile Sections", /*#__PURE__*/

    React.createElement("span", { className: "section-counter" }, "(",
    formData.sections.length, " ", formData.sections.length === 1 ? 'section' : 'sections', ")"
    )
    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      type: "button",
      variant: "outline",
      onClick: handleAddSection,
      className: "add-section-button" }, /*#__PURE__*/

    React.createElement(FiPlus, null), " Add Profile Section"
    )
    ), /*#__PURE__*/

    React.createElement("p", { className: "helper-text mb-4" }, "Divide your profile into sections to organize related information (e.g., Personal Details, Education History, Work Experience)."

    ), /*#__PURE__*/

    React.createElement("div", { className: "sections-list" },
    formData.sections.map((section, index) => /*#__PURE__*/
    React.createElement("div", { key: index, className: "section-item" }, /*#__PURE__*/
    React.createElement("div", { className: "section-inputs" }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", null, "Profile Section Name"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      value: section.label,
      onChange: (e) => handleSectionChange(index, e.target.value),
      placeholder: "e.g., Personal Information, Education History, Work Experience",
      className: errors.sections?.[index]?.label ? 'error' : '' }
    ),
    errors.sections?.[index]?.label && /*#__PURE__*/
    React.createElement("span", { className: "error-message" }, /*#__PURE__*/
    React.createElement(FiAlertCircle, null),
    errors.sections[index].label
    )

    )
    ),

    formData.sections.length > 1 && /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      onClick: () => handleRemoveSection(index),
      className: "remove-section-button",
      title: "Remove profile section" }, /*#__PURE__*/

    React.createElement(FiTrash2, null)
    )

    )
    )
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "modal-footer" }, /*#__PURE__*/
    React.createElement(AdminButton, {
      type: "button",
      variant: "outline",
      onClick: onClose },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement(AdminButton, {
      type: "submit",
      variant: "primary" },

    initialData ? 'Save Profile Type' : 'Create Profile Type'
    )
    )
    )
    )
    ));

};

export default SectionModal;