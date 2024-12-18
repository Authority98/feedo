/**
 * ProfileSectionContainer Component
 * 
 * Features:
 * - Horizontal scrolling sections with overflow menu
 * - Responsive "More" dropdown for extra sections
 * - Keyboard navigation support
 */

import React, { useState, useEffect, useRef } from 'react';
import './ProfileSectionContainer.css';

const ProfileSectionContainer = ({ sections, activeSection, onSectionChange }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);
  const [overflowSections, setOverflowSections] = useState([]);
  const containerRef = useRef(null);
  const moreButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const calculateVisibleSections = () => {
      if (!containerRef.current || !sections) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      let totalWidth = 0;
      const sectionElements = container.querySelectorAll('.section-btn:not(.more-btn)');
      const moreButtonWidth = 100; // Approximate width of "More" button

      let visibleCount = 0;
      sectionElements.forEach((section, index) => {
        totalWidth += section.offsetWidth;
        if (totalWidth + moreButtonWidth < containerWidth && index < 7) {// Show up to 7 sections
          visibleCount++;
        }
      });

      // Always show 5 sections, but no more than 7
      visibleCount = Math.min(7, Math.max(5, visibleCount));

      // If we have 7 or fewer sections total, show them all
      if (sections.length <= 7) {
        setVisibleSections(sections);
        setOverflowSections([]);
      } else {
        setVisibleSections(sections.slice(0, visibleCount));
        setOverflowSections(sections.slice(visibleCount));
      }
    };

    calculateVisibleSections();
    window.addEventListener('resize', calculateVisibleSections);

    return () => window.removeEventListener('resize', calculateVisibleSections);
  }, [sections]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      !moreButtonRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleOverflowSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    setShowMoreMenu(false);
  };

  if (!sections || sections.length === 0) {
    return null;
  }

  return (/*#__PURE__*/
    React.createElement("div", { className: "sections-wrapper" }, /*#__PURE__*/
    React.createElement("div", { ref: containerRef, className: "sections-container" },
    visibleSections.map((section) => /*#__PURE__*/
    React.createElement("button", {
      key: section.id,
      className: `section-btn ${activeSection === section.id ? 'active' : ''}`,
      onClick: () => onSectionChange(section.id) },

    section.label
    )
    ),

    overflowSections.length > 0 && /*#__PURE__*/
    React.createElement("div", { className: "more-sections-wrapper" }, /*#__PURE__*/
    React.createElement("button", {
      ref: moreButtonRef,
      className: `section-btn more-btn ${overflowSections.some((section) => section.id === activeSection) ? 'active' : ''}`,
      onClick: handleMoreClick },
    "More ",
    overflowSections.some((section) => section.id === activeSection) && '•'
    ),

    showMoreMenu && /*#__PURE__*/
    React.createElement("div", { ref: dropdownRef, className: "more-sections-dropdown" },
    overflowSections.map((section) => /*#__PURE__*/
    React.createElement("button", {
      key: section.id,
      className: `dropdown-item ${activeSection === section.id ? 'active' : ''}`,
      onClick: () => handleOverflowSectionClick(section.id) },

    section.label
    )
    )
    )

    )

    )
    ));

};

export default ProfileSectionContainer;