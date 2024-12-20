/**
 * Application Management Service
 * 
 * Centralizes all application-related operations and data transformations.
 * Provides consistent interface for:
 * - CRUD operations on applications
 * - Data transformations
 * - Status management
 * - Document handling
 */

import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp } from
'firebase/firestore';

// Application operations
export const applicationOperations = {
  // Create new application
  async createApplication(applicationData) {
    try {
      const applicationsRef = collection(db, 'applications');
      const timestamp = serverTimestamp();

      const newApplication = {
        ...applicationData,
        createdAt: timestamp,
        updatedAt: timestamp,
        lastActivity: timestamp
      };

      const docRef = await addDoc(applicationsRef, newApplication);
      return { id: docRef.id, ...newApplication };
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get user's applications
  async getUserApplications(userId, filters = {}) {
    try {
      const applicationsRef = collection(db, 'applications');
      let q = query(
        applicationsRef,
        where('userId', '==', userId)
      );

      // Only add status filter if provided
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting applications:', error);
      throw error;
    }
  },

  // Update application
  async updateApplication(applicationId, updates) {
    try {


      const applicationRef = doc(db, 'applications', applicationId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      };

      await updateDoc(applicationRef, updateData);

      // Get the updated document to return the complete data
      const updatedDoc = await getDoc(applicationRef);
      const updatedData = updatedDoc.data();



      return {
        id: applicationId,
        ...updatedData,
        // Ensure deadline is properly formatted
        deadline: updatedData.deadline || null
      };
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Delete application
  async deleteApplication(applicationId) {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await deleteDoc(applicationRef);
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Get application statistics
  async getApplicationStats(userId) {
    try {
      if (!userId) {
        console.error('userId is required for getApplicationStats');
        return {
          total: 0,
          active: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          incomplete: 0,
          followUp: 0
        };
      }

      // First get all user's applications
      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      // Initialize stats object
      const stats = {
        total: 0,
        active: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        incomplete: 0,
        followUp: 0
      };

      // Calculate stats from actual applications
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        stats.total++;

        // Convert 'follow-up' to 'followUp' for consistency
        const status = data.status || 'incomplete';
        const statusKey = status === 'follow-up' ? 'followUp' : status;
        if (stats.hasOwnProperty(statusKey)) {
          stats[statusKey]++;
        }
      });


      return stats;
    } catch (error) {
      console.error('Error getting application stats:', error);
      return {
        total: 0,
        active: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        incomplete: 0,
        followUp: 0
      };
    }
  }
};

// Helper functions for application data
export const createApplicationDataStructure = (data) => {
  return {
    name: data.name || '',
    category: data.category || '',
    description: data.description || '',
    status: data.status || 'incomplete',
    progress: data.progress || 0,
    userId: data.userId,
    companyId: data.companyId || null,
    documents: data.documents || [],
    interviews: data.interviews || [],
    notes: data.notes || '',
    feedback: data.feedback || '',
    isArchived: false
  };
};

// Add opportunity operations to existing file
export const opportunityOperations = {
  // Create new opportunity
  async createOpportunity(opportunityData) {
    try {
      const opportunitiesRef = collection(db, 'opportunities');
      const timestamp = serverTimestamp();

      const newOpportunity = {
        ...opportunityData,
        createdAt: timestamp,
        updatedAt: timestamp,
        lastActivity: timestamp
      };

      const docRef = await addDoc(opportunitiesRef, newOpportunity);
      return { id: docRef.id, ...newOpportunity };
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  },

  // Get opportunities
  async getOpportunities(filters = {}) {
    try {
      if (!filters.userId) {
        console.error('userId is required for getOpportunities');
        return [];
      }

      const opportunitiesRef = collection(db, 'opportunities');

      // Base query to get only the current user's opportunities
      let q = query(
        opportunitiesRef,
        where('creatorId', '==', filters.userId)
      );

      // Add status filter if provided
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      // Add ordering by lastActivity
      q = query(q, orderBy('lastActivity', 'desc'));

      const querySnapshot = await getDocs(q);

      // Transform the data to handle timestamps and ensure all fields are present
      const opportunities = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        // Convert timestamps to ISO strings
        const timestamps = ['createdAt', 'updatedAt', 'lastActivity', 'deadline'];
        timestamps.forEach((field) => {
          if (data[field] && typeof data[field].toDate === 'function') {
            data[field] = data[field].toDate().toISOString();
          }
        });

        // Log each opportunity for debugging


        // Ensure all required fields are present with defaults
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'job',
          creatorId: data.creatorId,
          status: data.status || 'active',
          matchPercentage: data.matchPercentage || 0,
          applicationProgress: data.applicationProgress || 0,
          isPerfectMatch: data.isPerfectMatch || false,
          isClosingSoon: data.isClosingSoon || false,
          deadline: data.deadline || new Date().toISOString(),
          location: data.location || {},
          compensation: data.compensation || {},
          requirements: data.requirements || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          lastActivity: data.lastActivity || new Date().toISOString(),
          visibility: data.visibility || 'public',
          ...data // Include any other fields from the document
        };
      });

      // Log the final opportunities array


      return opportunities;
    } catch (error) {
      console.error('Error getting opportunities:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get opportunity statistics
  async getOpportunityStats(userId) {
    try {
      if (!userId) {
        console.error('userId is required for getOpportunityStats');
        return {
          total: 0,
          active: 0,
          perfectMatches: 0,
          newOpportunities: 0,
          closingSoon: 0,
          closingToday: 0,
          closingThisWeek: 0,
          closingThisMonth: 0,
          successRate: 0,
          highlyMatched: 0
        };
      }

      const opportunitiesRef = collection(db, 'opportunities');
      const q = query(
        opportunitiesRef,
        where('creatorId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const stats = {
        total: 0,
        active: 0,
        perfectMatches: 0,
        newOpportunities: 0,
        closingSoon: 0,
        closingToday: 0,
        closingThisWeek: 0,
        closingThisMonth: 0,
        successRate: 0,
        highlyMatched: 0
      };

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneWeek = new Date(today);
      oneWeek.setDate(oneWeek.getDate() + 7);
      
      // Get the last day of current month
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Check if the opportunity has a valid deadline and hasn't passed
        const deadline = data.deadline ? new Date(data.deadline) : null;
        const isActive = deadline && deadline > now;
        
        if (!isActive) {
          return; // Skip inactive opportunities
        }

        stats.total++;
        stats.active++; // Count all valid opportunities as active

        // Count new opportunities (created in last 7 days)
        const createdAt = data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt)) : null;
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Only count if we have a valid creation date
        if (createdAt && !isNaN(createdAt.getTime())) {
          const createdAtTime = createdAt.getTime();
          if (createdAtTime >= sevenDaysAgo.getTime() && createdAtTime <= now.getTime()) {
            stats.newOpportunities++;
          }
        }

        // Count highly matched opportunities (90% or higher)
        if (data.matchPercentage >= 90) {
          stats.highlyMatched++;
          stats.perfectMatches++;
        }

        // Calculate days until deadline
        const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        // Count deadline categories
        if (daysUntilDeadline > 0) {
          if (daysUntilDeadline <= 1) {
            stats.closingToday++;
          }
          if (daysUntilDeadline <= 7) {
            stats.closingThisWeek++;
            stats.closingSoon++;
          }
          // Check if deadline is within current month
          if (deadline <= lastDayOfMonth) {
            stats.closingThisMonth++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting opportunity stats:', error);
      return {
        total: 0,
        active: 0,
        perfectMatches: 0,
        newOpportunities: 0,
        closingSoon: 0,
        closingToday: 0,
        closingThisWeek: 0,
        closingThisMonth: 0,
        successRate: 0,
        highlyMatched: 0
      };
    }
  }
};

// Helper function to create opportunity data structure
export const createOpportunityDataStructure = (data) => {
  // Generate random progress between 0-100
  const randomProgress = Math.floor(Math.random() * 100);

  // Generate random deadline between 7-60 days from now
  const generateDeadline = () => {
    // 40% chance of deadline within next 7 days
    if (Math.random() < 0.4) {
      const daysUntilDeadline = Math.floor(Math.random() * 7) + 1; // 1-7 days
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + daysUntilDeadline);
      return deadline;
    }
    // Otherwise, generate deadline between 8-30 days
    const randomDays = Math.floor(Math.random() * 23) + 8; // 8-30 days
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + randomDays);
    return deadline;
  };

  const deadline = generateDeadline();

  // Generate match percentage with higher probability of good matches
  const generateMatchPercentage = () => {
    // 30% chance of perfect match (90-100%)
    if (Math.random() < 0.3) {
      return Math.floor(Math.random() * (100 - 90) + 90);
    }
    // 40% chance of good match (70-89%)
    if (Math.random() < 0.7) {
      return Math.floor(Math.random() * (89 - 70) + 70);
    }
    // 30% chance of lower match (50-69%)
    return Math.floor(Math.random() * (69 - 50) + 50);
  };

  // Generate match percentage
  const matchPercentage = data.matchPercentage || generateMatchPercentage();

  // Determine if it's a perfect match (90% or higher)
  const isPerfectMatch = matchPercentage >= 90;

  // Determine if it's closing soon (7 days or less)
  const daysUntilDeadline = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = daysUntilDeadline <= 7;

  // Add some randomization to the status
  const statuses = ['new', 'active', 'closing-soon'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  // If deadline is within 7 days, force status to 'closing-soon'
  const status = isClosingSoon ? 'closing-soon' : randomStatus;

  return {
    type: data.type || 'job',
    creatorId: data.creatorId,
    title: data.title || '',
    description: data.description || '',
    requirements: data.requirements || [],
    location: {
      type: data.location?.type || 'remote',
      address: data.location?.address || '',
      country: data.location?.country || '',
      city: data.location?.city || ''
    },
    category: data.category || '',
    status: status,
    visibility: data.visibility || 'public',
    compensation: {
      type: data.compensation?.type || 'paid',
      amount: data.compensation?.amount || null,
      currency: data.compensation?.currency || null,
      details: data.compensation?.details || ''
    },
    matchPercentage,
    isPerfectMatch, // Will be true for matches >= 90%
    isClosingSoon, // Will be true for deadlines within 7 days
    applicationProgress: randomProgress,
    deadline: deadline.toISOString(),
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };
};