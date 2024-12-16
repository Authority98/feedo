import React from 'react';
import PropTypes from 'prop-types';
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiClock, 
  FiAlertCircle,
  FiSun,
  FiActivity
} from 'react-icons/fi';
import './StatusBadge.css';

const STATUS_CONFIG = {
  // Application statuses
  pending: {
    color: 'yellow',
    icon: FiClock,
    label: 'Pending',
    variant: 'application'
  },
  approved: {
    color: 'green',
    icon: FiCheckCircle,
    label: 'Approved',
    variant: 'application'
  },
  rejected: {
    color: 'red',
    icon: FiAlertTriangle,
    label: 'Rejected',
    variant: 'application'
  },
  'follow-up': {
    color: 'orange',
    icon: FiActivity,
    label: 'Follow Up',
    variant: 'application'
  },
  incomplete: {
    color: 'gray',
    icon: FiAlertCircle,
    label: 'Incomplete',
    variant: 'application'
  },

  // Opportunity statuses
  new: {
    color: 'green',
    icon: FiSun,
    label: 'New',
    variant: 'opportunity'
  },
  active: {
    color: 'blue',
    icon: FiActivity,
    label: 'Active',
    variant: 'opportunity'
  },
  'closing-soon': {
    color: 'orange',
    icon: FiClock,
    label: 'Closing Soon',
    variant: 'opportunity'
  }
};

const StatusBadge = ({ 
  status, 
  showIcon = false,
  customLabel,
  customColor,
  customIcon: CustomIcon,
  className = '',
  onClick
}) => {
  // Get status configuration or use custom values
  const config = STATUS_CONFIG[status] || {
    color: customColor || 'gray',
    icon: CustomIcon || FiActivity,
    label: customLabel || status,
    variant: 'default'
  };

  // Generate CSS classes
  const badgeClasses = [
    'status-badge',
    status,
    `status-badge-${config.color}`,
    `variant-${config.variant}`,
    onClick ? 'clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const Icon = config.icon;
  const label = customLabel || config.label || status;

  return (
    <span 
      className={badgeClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="status-label">{label}</span>
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  customLabel: PropTypes.string,
  customColor: PropTypes.string,
  customIcon: PropTypes.elementType,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default StatusBadge; 