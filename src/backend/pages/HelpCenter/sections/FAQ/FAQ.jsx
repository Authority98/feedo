/**
 * FAQ Section Component
 * 
 * A comprehensive FAQ interface that provides:
 * - Expandable FAQ items with smooth animations
 * - Question and answer display
 * - Progress tracking for answered questions
 * - Interactive hover states
 * - Accessibility features
 * 
 * Features:
 * - Animated accordion functionality
 * - Progress tracking
 * - Staggered animations
 * - Keyboard navigation
 * - ARIA attributes for accessibility
 */

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import AnimatedNumber from '../../../../../components/Animated/AnimatedNumber';
import './FAQ.css';

const FAQ = () => {
  /**
   * State Management
   */
  const [openIndex, setOpenIndex] = useState(null); // Tracks currently open FAQ item
  const [totalQuestions] = useState(8); // Updated total
  const [answeredQuestions, setAnsweredQuestions] = useState(0); // Tracks viewed questions

  /**
   * FAQ data array
   * Each item contains:
   * - Question text
   * - Answer text
   * - Optional metadata
   */
  const faqItems = [
  {
    question: "What is Feedo AI and how does it help with job applications?",
    answer: "Feedo AI is an intelligent application management platform that streamlines your job application process. It uses advanced AI to help you auto-fill applications, track your progress, and manage multiple applications efficiently. The platform provides smart suggestions, deadline reminders, and helps maintain consistency across all your applications."
  },
  {
    question: "How does the AI auto-fill feature work?",
    answer: "The AI auto-fill feature analyzes your profile information and previous applications to intelligently populate new application forms. It learns from your past submissions to ensure accuracy and consistency. The feature can auto-fill common fields like personal information, work experience, and education details, while allowing you to review and customize the content before submission."
  },
  {
    question: "Can I track the status of multiple applications at once?",
    answer: "Yes! Feedo AI provides a comprehensive dashboard where you can track all your applications in real-time. You can see the status of each application (pending, approved, rejected, etc.), upcoming deadlines, required actions, and progress indicators. The platform also sends timely notifications for important updates and deadlines."
  },
  {
    question: "How secure is my personal information on Feedo?",
    answer: "We take data security very seriously. All your personal information is encrypted using industry-standard protocols, and we follow strict data protection guidelines. We use secure cloud storage, implement regular security audits, and never share your information with third parties without your explicit consent. Our platform complies with GDPR and other relevant data protection regulations."
  },
  {
    question: "What should I do if I need help with a specific application?",
    answer: "If you need assistance with a specific application, you have several options:\n\n<ol><li><span>Use the AI assistant feature for immediate guidance</span></li><li><span>Check our detailed help documentation</span></li><li><span>Contact our support team through the help center</span></li><li><span>Use the community forum to get advice from other users</span></li></ol>\n\nOur support team typically responds within 24 hours for any specific queries."
  },
  {
    question: "Can I customize the application tracking process?",
    answer: "Absolutely! Feedo AI offers extensive customization options:\n\n<ul><li>Create custom status labels</li><li>Set up personalized notification preferences</li><li>Design custom application workflows</li><li>Add custom fields to track specific information</li><li>Create templates for different types of applications</li></ul>\n\nYou can tailor the platform to match your specific application tracking needs."
  },
  {
    question: "Is there a limit to how many applications I can manage?",
    answer: "The number of applications you can manage depends on your subscription plan:\n\n<ul><li>Free Plan: Up to 5 active applications</li><li>Basic Plan: Up to 20 active applications</li><li>Premium Plan: Unlimited applications</li></ul>\n\nAll plans include core features like status tracking, notifications, and basic AI assistance."
  },
  {
    question: "How can I improve my application success rate using Feedo?",
    answer: "Feedo AI provides several tools to improve your success rate:\n\n<ol><li><span>AI-powered application optimization suggestions</span></li><li><span>Analytics dashboard showing application performance metrics</span></li><li><span>Best practices recommendations based on successful applications</span></li><li><span>Automated deadline reminders to ensure timely submissions</span></li><li><span>Document version control for resumes and cover letters</span></li></ol>\n\nRegularly checking these insights and following the recommendations can significantly improve your application success rate."
  }];


  /**
   * Handle FAQ item toggle
   * - Updates open/closed state
   * - Tracks viewed questions
   * - Manages animations
   * @param {number} index - Index of clicked FAQ item
   */
  const toggleFaq = (index) => {
    if (openIndex !== index) {
      setAnsweredQuestions((prev) => Math.min(prev + 1, totalQuestions));
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "faq-section" }, /*#__PURE__*/

    React.createElement("div", { className: "flex items-center justify-between mb-6" }, /*#__PURE__*/
    React.createElement("h2", { className: "section-title" }, "Frequently Asked Questions"), /*#__PURE__*/
    React.createElement("div", { className: "text-sm text-gray-500" }, /*#__PURE__*/
    React.createElement(AnimatedNumber, { value: answeredQuestions }), " of ", /*#__PURE__*/React.createElement(AnimatedNumber, { value: totalQuestions }), " questions answered"
    )
    ), /*#__PURE__*/


    React.createElement("div", { className: "faq-list" },
    faqItems.map((item, index) => /*#__PURE__*/
    React.createElement("div", {
      key: index,
      className: `faq-item ${openIndex === index ? 'active' : ''}` }, /*#__PURE__*/


    React.createElement("button", {
      className: "faq-question",
      onClick: () => toggleFaq(index),
      "aria-expanded": openIndex === index }, /*#__PURE__*/

    React.createElement("span", null, item.question), /*#__PURE__*/
    React.createElement(FiChevronDown, { className: "faq-icon" })
    ), /*#__PURE__*/


    React.createElement("div", {
      className: "faq-answer",
      dangerouslySetInnerHTML: { __html: item.answer.split('\n\n').map((p) => `<p>${p}</p>`).join('') } }
    )
    )
    )
    )
    ));

};

/**
 * Export the FAQ component
 * This component provides:
 * - Interactive FAQ functionality
 * - Progress tracking
 * - Animated transitions
 * - Accessibility features
 * - Responsive design
 */
export default FAQ;