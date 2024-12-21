/**
 * StatCards Component
 * 
 * Purpose: Displays key statistics in an visually appealing card layout
 * 
 * Features:
 * - Real-time stats from Firestore
 * - Animated number transitions
 * - Interactive hover effects
 * - Gradient backgrounds
 * - Clickable cards for filtering
 */

import React, { useState, useEffect } from 'react';
import {
  FiFileText, // Total opportunities
  FiStar, // Perfect matches
  FiTrendingUp, // Success rate
  FiClock // Closing soon
} from 'react-icons/fi';
import AnimatedNumber from '../../../../../components/Animated/AnimatedNumber';
import { opportunityOperations } from '../../../../../applications/applicationManager';
import './StatCards.css';
import { useAuth } from '../../../../../auth/AuthContext';

const StatCards = ({ refreshTrigger = 0, onFilterChange, activeFilter = null }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    perfectMatches: 0,
    newOpportunities: 0,
    successRate: 0,
    closingSoon: 0,
    highlyMatched: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats when component mounts or refreshTrigger changes
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.profile?.authUid) return;

      try {
        setLoading(true); // Show loading state while refreshing
        const statsData = await opportunityOperations.getOpportunityStats(user.profile.authUid);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger, user?.profile?.authUid]); // Add user.profile.authUid to dependencies

  // Stats configuration with real data
  const statsConfig = [
  {
    id: 'total',
    icon: FiFileText,
    title: "Total Opportunities",
    value: stats.total,
    trend: "+12%",
    bgColor: "bg-[#00b4d2]"
  },
  {
    id: 'new',
    icon: FiStar,
    title: "New Opportunities",
    value: stats.newOpportunities,
    trend: "Last 7 days",
    bgColor: "bg-[#527991]"
  },
  {
    id: 'matches',
    icon: FiTrendingUp,
    title: "90%+ Matches",
    value: stats.highlyMatched,
    trend: "Match ≥ 90%",
    bgColor: "bg-[#34b800]"
  },
  {
    id: 'closing',
    icon: FiClock,
    title: "Closing Soon",
    value: stats.closingSoon,
    trend: "Next 7 days",
    bgColor: "bg-[#ff7a15]"
  }];

  const handleCardClick = (statId) => {
    if (onFilterChange && activeFilter !== statId) {
      onFilterChange(statId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat) => (
        <div
          key={stat.id}
          onClick={() => handleCardClick(stat.id)}
          className={`${stat.bgColor} rounded-xl p-6 text-white transition-all duration-300 cursor-pointer
            ${activeFilter === stat.id 
              ? 'scale-105 shadow-[0_0_15px_rgba(0,0,0,0.2)]' 
              : 'hover:scale-105 hover:shadow-lg hover:shadow-black/20'
            }
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <stat.icon className="w-6 h-6 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              {stat.trend}
            </span>
          </div>

          <h3 className="text-lg font-medium mb-2">{stat.title}</h3>

          <p className="text-3xl font-bold">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <>
                <AnimatedNumber value={stat.value} duration={2000} />
                {stat.isPercentage && '%'}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

const styles = `
  .active-card {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default StatCards;