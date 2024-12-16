import React from 'react';
import { FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import CloseButton from '../../../../../components/CloseButton/CloseButton';
import StatusBadge from '../../../../../components/StatusBadge/StatusBadge';
import './ApplicationPanel.css';

const ApplicationPanel = ({ isOpen, onClose, application }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="application-panel-overlay" onClick={onClose}>
      <div className="application-panel" onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} position="right" />

        <div className="panel-content">
          <div className="panel-header">
            <h2 className="panel-title">{application.name}</h2>
            <StatusBadge 
              status={application.status}
              variant="application"
            />
          </div>

          <div className="panel-section">
            <h3 className="section-title">Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <FiCalendar className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Submission Date</span>
                  <span className="detail-value">{formatDate(application.submissionDate)}</span>
                </div>
              </div>

              <div className="detail-item">
                <FiClock className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Deadline</span>
                  <span className="detail-value">{formatDate(application.deadline)}</span>
                </div>
              </div>

              <div className="detail-item">
                <FiFileText className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{application.category}</span>
                </div>
              </div>
            </div>
          </div>

          {application.description && (
            <div className="panel-section">
              <h3 className="section-title">Description</h3>
              <p className="description-text">{application.description}</p>
            </div>
          )}

          {application.notes && (
            <div className="panel-section">
              <h3 className="section-title">Notes</h3>
              <p className="notes-text">{application.notes}</p>
            </div>
          )}

          {application.feedback && (
            <div className="panel-section">
              <h3 className="section-title">Feedback</h3>
              <p className="feedback-text">{application.feedback}</p>
            </div>
          )}

          <div className="panel-section mt-auto">
            <button 
              className="apply-now-btn w-full"
              onClick={() => window.open(application.applyUrl || '#', '_blank')}
              style={{ backgroundColor: '#246BFD', color: 'white' }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPanel; 