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
  const [totalQuestions] = useState(15); // Updated total
  const [answeredQuestions, setAnsweredQuestions] = useState(0); // Tracks viewed questions

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

  /**
   * Handle live chat link click
   * @param {Event} e - Click event
   */
  const handleLiveChatClick = (e) => {
    // Check if the clicked link is the live chat link
    if (e.target.href && e.target.href.includes('feedo.ai/livechat')) {
      e.preventDefault();
      // Open Crisp chat
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  /**
   * FAQ data array
   * Each item contains:
   * - Question text
   * - Answer text
   * - Optional metadata
   */
  const faqItems = [
    {
      question: "What is Feedo, and how can it help me with applications?",
      answer: "Feedo is an AI-powered platform that automates application processes for Entrepreneurs, Job Seekers, Students, and Startups. Our goal is to help you save time by using advanced autofill technology, so you can focus on growing your career or business. Learn more about our features at <a href='https://feedo.ai/solution' target='_blank' rel='noopener noreferrer'>feedo.ai/solution</a>."
    },
    {
      question: "How do I download the Feedo Chrome extension?",
      answer: "You can easily download the Feedo extension from the Chrome Web Store. Visit <a href='https://www.feedo.ai/download-extension' target='_blank' rel='noopener noreferrer'>www.feedo.ai/download-extension</a> to get started. Once installed, our AI-driven extension integrates seamlessly to autofill forms and simplify your application experience."
    },
    {
      question: "How do I use Feedo, and is there a demo available?",
      answer: "Feedo is simple to use! After setting up your account, our AI will guide you through application processes, helping you autofill fields and manage submissions. Watch our step-by-step demo on YouTube at <a href='https://www.feedo.ai/demo' target='_blank' rel='noopener noreferrer'>www.feedo.ai/demo</a>, where you can see Feedo in action."
    },
    {
      question: "What types of users benefit from Feedo?",
      answer: "Feedo is designed for various users, including Job Seekers, Entrepreneurs seeking investment or acceleration, Students applying for scholarships, and Companies pursuing tenders or grants. Each user type has unique tools and resources for success. Check out our User Types page at <a href='https://www.feedo.ai/user-types' target='_blank' rel='noopener noreferrer'>www.feedo.ai/user-types</a> for more information."
    },
    {
      question: "How does Feedo's pricing work?",
      answer: "Feedo offers flexible pricing plans for different needs, including a free plan and premium options with advanced features. For detailed pricing information, please visit <a href='https://www.feedo.ai/pricing' target='_blank' rel='noopener noreferrer'>www.feedo.ai/pricing</a>."
    },
    {
      question: "Can I use Feedo for free?",
      answer: "Yes, Feedo offers a free version with essential features. For enhanced tools like personalized opportunity recommendations and AI-based insights, you can upgrade to one of our premium plans. Check <a href='https://www.feedo.ai/pricing' target='_blank' rel='noopener noreferrer'>www.feedo.ai/pricing</a> for details."
    },
    {
      question: "How does Feedo's AI work for autofilling applications?",
      answer: "Feedo's AI learns from your submitted data to autofill similar fields in different applications, saving you valuable time. It also recommends opportunities based on your profile, increasing your chances of finding the perfect fit. Discover more on our AI Technology page at <a href='https://www.feedo.ai/ai-technology' target='_blank' rel='noopener noreferrer'>www.feedo.ai/ai-technology</a>."
    },
    {
      question: "How secure is my data on Feedo?",
      answer: "Data security is our top priority. Feedo uses advanced encryption to protect your information, ensuring only you have access. Learn more about our data security measures at <a href='https://www.feedo.ai/security' target='_blank' rel='noopener noreferrer'>www.feedo.ai/security</a>."
    },
    {
      question: "How can I subscribe to Feedo?",
      answer: "To subscribe, go to <a href='https://www.feedo.ai/login' target='_blank' rel='noopener noreferrer'>www.feedo.ai/login</a>, create an account, and choose the plan that fits your needs. You'll gain immediate access to our features, including AI autofill and personalized recommendations."
    },
    {
      question: "Can I manage multiple applications within Feedo?",
      answer: "Yes, Feedo's dashboard allows you to manage, edit, and track multiple applications in one place, keeping you organized and up-to-date on each application's progress. See how our Dashboard can help you stay organized at <a href='https://www.feedo.ai/dashboard' target='_blank' rel='noopener noreferrer'>www.feedo.ai/dashboard</a>."
    },
    {
      question: "What payment methods are accepted on Feedo?",
      answer: "We accept major payment methods, including credit cards and PayPal, for easy and secure transactions. For more details, please check our Payment Options at <a href='https://www.feedo.ai/payment-options' target='_blank' rel='noopener noreferrer'>www.feedo.ai/payment-options</a>."
    },
    {
      question: "Does Feedo support different languages?",
      answer: "Yes, Feedo offers multi-language support to serve our global users. You can adjust the language preference in Settings at <a href='https://www.feedo.ai/settings' target='_blank' rel='noopener noreferrer'>www.feedo.ai/settings</a>."
    },
    {
      question: "Can Feedo help with my pitch deck or business plan?",
      answer: "Absolutely. Feedo's premium AI tools assist Entrepreneurs and Startups with creating pitch decks, business plans, and other essential documents for funding applications. Learn more about our Business Tools at <a href='https://www.feedo.ai/business-tools' target='_blank' rel='noopener noreferrer'>www.feedo.ai/business-tools</a>."
    },
    {
      question: "How do I upgrade my Feedo plan?",
      answer: "To upgrade, log in to Feedo, go to <a href='https://www.feedo.ai/plans' target='_blank' rel='noopener noreferrer'>www.feedo.ai/plans</a>, and select the plan that suits you best. Upgraded features are available instantly."
    },
    {
      question: "What should I do if I encounter issues with the Feedo extension?",
      answer: "Visit our Help Center for troubleshooting tips at <a href='https://www.feedo.ai/help-center' target='_blank' rel='noopener noreferrer'>www.feedo.ai/help-center</a> or contact our support team via Live Chat at <a href='https://feedo.ai/livechat' onClick={handleLiveChatClick}>feedo.ai/livechat</a>. We're here to help!"
    }
  ];

  return (
    <div className="faq-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="text-sm text-gray-500">
          <AnimatedNumber value={answeredQuestions} /> of <AnimatedNumber value={totalQuestions} /> questions answered
        </div>
      </div>

      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'active' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <FiChevronDown className="faq-icon" />
            </button>

            <div
              className="faq-answer"
              onClick={handleLiveChatClick}
              dangerouslySetInnerHTML={{ __html: item.answer.split('\n\n').map((p) => `<p>${p}</p>`).join('') }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;