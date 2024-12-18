import React, { useState, useEffect } from 'react';
import { applicationOperations } from '../../../../../applications/applicationManager';
import Button from '../../../../../components/Button/Button';
import CloseButton from '../../../../../components/CloseButton/CloseButton';
import './EditApplicationPanel.css';

const EditApplicationPanel = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    status: '',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (application) {



      // Convert UTC date to local date for the input
      let formattedDate = '';
      if (application.deadline) {
        const date = new Date(application.deadline);
        // Add timezone offset to get the correct local date
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        formattedDate = date.toISOString().split('T')[0];
      }



      setFormData({
        name: application.name || '',
        category: application.category || '',
        description: application.description || '',
        status: application.status || '',
        deadline: formattedDate
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deadline') {

    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert local date to UTC for storage
      let deadlineUTC = null;
      if (formData.deadline) {
        const date = new Date(formData.deadline);
        // Subtract timezone offset to get UTC
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        deadlineUTC = date.toISOString();
      }

      const updatedData = {
        ...formData,
        deadline: deadlineUTC
      };



      const updatedApplication = await applicationOperations.updateApplication(application.id, updatedData);


      onUpdate(updatedApplication);
      onClose();
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (/*#__PURE__*/
    React.createElement("div", { className: "slide-panel-overlay", onClick: onClose }, /*#__PURE__*/
    React.createElement("div", { className: "slide-panel-wrapper", onClick: (e) => e.stopPropagation() }, /*#__PURE__*/
    React.createElement(CloseButton, { onClick: onClose, position: "left" }), /*#__PURE__*/

    React.createElement("div", { className: "slide-panel-content" }, /*#__PURE__*/
    React.createElement("form", { onSubmit: handleSubmit, className: "edit-application-form" }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "name" }, "Application Name"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      id: "name",
      name: "name",
      value: formData.name,
      onChange: handleChange,
      placeholder: "Enter application name",
      required: true }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "category" }, "Category"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      id: "category",
      name: "category",
      value: formData.category,
      onChange: handleChange,
      placeholder: "Enter category",
      required: true }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "status" }, "Status"), /*#__PURE__*/
    React.createElement("select", {
      id: "status",
      name: "status",
      value: formData.status,
      onChange: handleChange,
      required: true }, /*#__PURE__*/

    React.createElement("option", { value: "" }, "Select Status"), /*#__PURE__*/
    React.createElement("option", { value: "pending" }, "Pending"), /*#__PURE__*/
    React.createElement("option", { value: "approved" }, "Approved"), /*#__PURE__*/
    React.createElement("option", { value: "rejected" }, "Rejected"), /*#__PURE__*/
    React.createElement("option", { value: "follow-up" }, "Follow-up"), /*#__PURE__*/
    React.createElement("option", { value: "incomplete" }, "Incomplete")
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "deadline" }, "Deadline"), /*#__PURE__*/
    React.createElement("input", {
      type: "date",
      id: "deadline",
      name: "deadline",
      value: formData.deadline,
      onChange: handleChange }
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "description" }, "Description"), /*#__PURE__*/
    React.createElement("textarea", {
      id: "description",
      name: "description",
      value: formData.description,
      onChange: handleChange,
      placeholder: "Enter description",
      rows: 4 }
    )
    ),

    error && /*#__PURE__*/React.createElement("div", { className: "error-message" }, error), /*#__PURE__*/

    React.createElement("div", { className: "form-actions" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "outline",
      onClick: onClose,
      disabled: loading,
      type: "button",
      className: "hover:text-inherit" },
    "Cancel"

    ), /*#__PURE__*/
    React.createElement(Button, {
      variant: "create",
      type: "submit",
      isLoading: loading },
    "Save Changes"

    )
    )
    )
    )
    )
    ));

};

export default EditApplicationPanel;