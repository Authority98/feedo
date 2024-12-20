/**
 * Signup Page Component
 * Features:
 * - Google Sign Up integration
 * - First name and Last name fields
 * - Email field
 * - Phone number with country code
 * - Password field with visibility toggle
 * - Terms and Privacy Policy links
 * - Login link for existing users
 * - Responsive design
 */

// React core imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Firebase imports
import { auth, db } from '../../../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Context imports
import { useAuth } from '../../../auth/AuthContext';
import { useToast } from '../../../components/Toast/ToastContext';

// Component imports
import TwoFactorVerification from '../../../components/TwoFactorVerification/TwoFactorVerification';
import SocialLogin from '../../../components/SocialLogin/SocialLogin';
import AuthToggle from '../../../components/AuthToggle/AuthToggle';
import AuthButton from '../../../components/AuthButton/AuthButton';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';

// Utility imports
import { validateUserData } from '../../../auth/validation';
import { AUTH_NOTIFICATIONS, handleAuthError } from '../../../components/Toast/toastnotifications';
import { calculatePasswordStrength, isPasswordValid } from '../../../utils/passwordUtils';

// Static assets
import { ReactComponent as GoogleIcon } from '../../../assets/icons/google.svg';
import { ReactComponent as EyeIcon } from '../../../assets/icons/eye.svg';
import feedoLogo from '../../../assets/images/feedo-logo.png';
import awardBadge from '../../../assets/images/award-badge.png';

// Styles
import './LoginSignup.css';

// Operations
import { userOperations, createUserDataStructure } from '../../../auth/userManager';

const LoginSignup = () => {
  const { signup, login, googleSignIn, verifyTwoFactor } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form state management
  // Stores user input for registration fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  // UI state management
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [currentTestimonial, setCurrentTestimonial] = useState(0); // Current testimonial index
  const [isSliding, setIsSliding] = useState(false); // Testimonial slide animation state
  const [errors, setErrors] = useState({}); // Form validation errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for async operations
  const [isSignupActive, setIsSignupActive] = useState(false); // Toggle between signup/login views

  // Add login-specific state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Add these new state variables inside LoginSignup component
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginData((prev) => ({
        ...prev,
        email: rememberedEmail
      }));
      setRememberMe(true);
    }
  }, []);

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(loginData.email, loginData.password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (result?.requiresTwoFactor) {
        setShowTwoFactorInput(true);
        return;
      }

      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        if (result?.user?.isPending) {
          navigate('/profile-type', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = handleAuthError(error);
      // Only set the form error, remove the toast
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 2FA verification
  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      const result = await verifyTwoFactor(twoFactorCode);

      // Navigate immediately on success
      if (result?.user?.isPending) {
        navigate('/profile-type', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('2FA error:', error);
      setErrors({ twoFactor: AUTH_NOTIFICATIONS.LOGIN.INVALID_2FA });
    }
    // Always set loading to false after try/catch
    setIsLoading(false);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await googleSignIn();

      // Add debug logging


      // Show success message for new users
      if (result?.isNewUser) {
        showToast('Account created successfully!', 'success');
      }

      // Navigate based on user state
      setTimeout(() => {
        if (result?.user?.isPending) {
          navigate('/profile-type', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 500);

    } catch (error) {
      console.error('Google sign in error:', error);
      const errorMessage = handleAuthError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Testimonials data array
  // Each testimonial contains quote, author details, and profile image
  const testimonials = [
  {
    quote: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change.",
    author: "Leslie Alexander",
    role: "Freelance React Developer",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    quote: "The platform is incredibly easy to use. I can now manage my website content without any technical knowledge.",
    author: "Sarah Johnson",
    role: "Digital Marketing Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    quote: "Outstanding platform! It has streamlined our entire content management process.",
    author: "Michael Chen",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
  }
  // Add more testimonials as needed
  ];

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic form validation
    const validationErrors = {};
    if (!formData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email';
    }

    // Validate password strength
    if (!isPasswordValid(formData.password)) {
      validationErrors.password = 'Password does not meet security requirements';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const result = await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      if (result?.success) {
        showToast('Account created successfully!', 'success');
        navigate('/profile-type', { replace: true });
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = handleAuthError(error);
      // Only show validation errors under the button, not auth errors
      if (error.code === 'auth/email-already-in-use' ||
      error.code === 'auth/invalid-email' ||
      error.code === 'auth/wrong-password') {
        // Don't set the error state for auth errors as they're shown in toast
        return;
      }
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Testimonial navigation handlers
  // Manages testimonial carousel functionality
  const handleDotClick = (index) => {
    setIsSliding(true);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setIsSliding(false);
    }, 500);
  };

  // Auto-rotate testimonials effect
  // Changes testimonial every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => {
          const nextIndex = prev === testimonials.length - 1 ? 0 : prev + 1;
          setIsSliding(false);
          return nextIndex;
        });
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Form validation function
  // Checks all required fields and format requirements
  // Returns boolean indicating if form is valid
  const validateForm = () => {
    const newErrors = {};
    const errorMessages = [];

    // Email validation
    if (!validateUserData.email(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      errorMessages.push('Invalid email address');
    }

    // Password validation
    if (!validateUserData.password(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
      errorMessages.push('Password must be at least 8 characters');
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      errorMessages.push('First name is required');
    } else if (!validateUserData.name(formData.firstName)) {
      newErrors.firstName = 'Please enter a valid first name (2-30 characters)';
      errorMessages.push('Invalid first name');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      errorMessages.push('Last name is required');
    } else if (!validateUserData.name(formData.lastName)) {
      newErrors.lastName = 'Please enter a valid last name (2-30 characters)';
      errorMessages.push('Invalid last name');
    }

    setErrors(newErrors);

    // If there are errors, show them in a single toast
    if (errorMessages.length > 0) {
      showToast(`Please fix the following: ${errorMessages.join(', ')}`, 'error');
      return false;
    }

    return true;
  };

  // Password strength calculator
  // Returns object with score (0-5) and strength label
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains number
    if (/\d/.test(password)) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return {
      score: strength,
      label: strength === 0 ? 'Very Weak' :
      strength === 1 ? 'Weak' :
      strength === 2 ? 'Fair' :
      strength === 3 ? 'Good' :
      strength === 4 ? 'Strong' : 'Very Strong'
    };
  };

  // Auth toggle handler
  // Manages transition between signup and login views
  const handleToggle = () => {
    setIsSignupActive(!isSignupActive);
    // Navigate to login page after a small delay for smooth transition
    if (isSignupActive) {
      setTimeout(() => {
        navigate('/login');
      }, 300);
    }
  };

  // Handle LinkedIn Sign Up
  const handleLinkedInSignUp = async () => {
    showToast('LinkedIn sign up is not available at the moment', 'info');
  };

  // Handle LinkedIn Sign In
  const handleLinkedInSignIn = async () => {
    showToast('LinkedIn sign in is not available at the moment', 'info');
  };

  // Add this new handler function inside LoginSignup component
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      showToast('Password reset email sent successfully!', 'success');
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = handleAuthError(error);
      setErrors({ resetEmail: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (/*#__PURE__*/
    React.createElement("div", { className: "signup-container" }, /*#__PURE__*/
    React.createElement("div", { className: "signup-left" }, /*#__PURE__*/
    React.createElement("img", { src: feedoLogo, alt: "Feedo AI Logo", className: "feedo-logo" }), /*#__PURE__*/
    React.createElement("div", { className: "testimonial" }, /*#__PURE__*/
    React.createElement("div", { className: `testimonial-content ${isSliding ? 'sliding-out' : ''}` }, /*#__PURE__*/
    React.createElement("p", { className: "quote" }, testimonials[currentTestimonial].quote), /*#__PURE__*/
    React.createElement("div", { className: "author" }, /*#__PURE__*/
    React.createElement("img", {
      src: testimonials[currentTestimonial].image,
      alt: testimonials[currentTestimonial].author,
      className: "author-photo" }
    ), /*#__PURE__*/
    React.createElement("div", { className: "author-info" }, /*#__PURE__*/
    React.createElement("h4", null, testimonials[currentTestimonial].author), /*#__PURE__*/
    React.createElement("p", null, testimonials[currentTestimonial].role)
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "testimonial-dots" },
    testimonials.map((_, index) => /*#__PURE__*/
    React.createElement("button", {
      key: index,
      className: `dot ${index === currentTestimonial ? 'active' : ''}`,
      onClick: () => handleDotClick(index),
      "aria-label": `View testimonial ${index + 1}` }
    )
    )
    )
    ), /*#__PURE__*/
    React.createElement("div", { className: "award-badges" }, /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" }), /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" }), /*#__PURE__*/
    React.createElement("img", { src: awardBadge, alt: "Award Badge" })
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "signup-right" }, /*#__PURE__*/
    React.createElement("div", { className: "signup-form-container" }, /*#__PURE__*/
    React.createElement(AuthToggle, {
      isSignupActive: isSignupActive,
      onToggle: setIsSignupActive }
    ),

    isSignupActive ? /*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(SocialLogin, {
      onGoogleClick: handleGoogleSignIn,
      onLinkedInClick: handleLinkedInSignUp,
      isLoading: isLoading,
      isSignUp: true }
    ), /*#__PURE__*/


    React.createElement("form", { onSubmit: handleSignup }, /*#__PURE__*/
    React.createElement("div", { className: "name-fields" }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "firstName" }, "First name"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      id: "firstName",
      name: "firstName",
      value: formData.firstName,
      onChange: handleChange,
      className: errors.firstName ? 'error' : '' }
    ),
    errors.firstName && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.firstName)
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "lastName" }, "Last name"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      id: "lastName",
      name: "lastName",
      value: formData.lastName,
      onChange: handleChange,
      className: errors.lastName ? 'error' : '' }
    ),
    errors.lastName && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.lastName)
    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "email" }, "Email"), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      id: "email",
      name: "email",
      value: formData.email,
      onChange: handleChange,
      className: errors.email ? 'error' : '' }
    ),
    errors.email && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.email)
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "password" }, "Password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input" }, /*#__PURE__*/
    React.createElement("input", {
      type: showPassword ? "text" : "password",
      id: "password",
      name: "password",
      value: formData.password,
      onChange: handleChange,
      className: errors.password ? 'error' : '' }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => setShowPassword(!showPassword) }, /*#__PURE__*/

    React.createElement(EyeIcon, null)
    )
    ),
    formData.password && /*#__PURE__*/
    React.createElement("div", { className: "password-strength" }, /*#__PURE__*/
    React.createElement("div", { className: "strength-bars" },
    [...Array(5)].map((_, index) => /*#__PURE__*/
    React.createElement("div", {
      key: index,
      className: `strength-bar ${
      index < calculatePasswordStrength(formData.password).score ?
      calculatePasswordStrength(formData.password).label.toLowerCase().replace(' ', '-') :
      ''}` }

    )
    )
    ), /*#__PURE__*/
    React.createElement("span", { className: `strength-label ${calculatePasswordStrength(formData.password).label.toLowerCase().replace(' ', '-')}` },
    calculatePasswordStrength(formData.password).label
    )
    ),

    errors.password && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.password)
    ), /*#__PURE__*/

    React.createElement(AuthButton, {
      isLoading: isLoading,
      loadingText: "Creating Account..." },
    "Create Account"

    ),

    errors.submit && /*#__PURE__*/
    React.createElement("div", { className: "error-message submit-error" },
    errors.submit
    )

    )
    ) : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(SocialLogin, {
      onGoogleClick: handleGoogleSignIn,
      onLinkedInClick: handleLinkedInSignIn,
      isLoading: isLoading,
      isSignUp: false }
    ), /*#__PURE__*/


    React.createElement("form", { onSubmit: handleLogin }, /*#__PURE__*/
    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "loginEmail" }, "Email"), /*#__PURE__*/
    React.createElement("input", {
      type: "email",
      id: "loginEmail",
      name: "email",
      value: loginData.email,
      onChange: handleLoginChange,
      className: errors.loginEmail ? 'error' : '',
      disabled: isLoading }
    ),
    errors.loginEmail && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.loginEmail)
    ), /*#__PURE__*/

    React.createElement("div", { className: "form-group" }, /*#__PURE__*/
    React.createElement("label", { htmlFor: "loginPassword" }, "Password"), /*#__PURE__*/
    React.createElement("div", { className: "password-input" }, /*#__PURE__*/
    React.createElement("input", {
      type: showLoginPassword ? "text" : "password",
      id: "loginPassword",
      name: "password",
      value: loginData.password,
      onChange: handleLoginChange,
      className: errors.loginPassword ? 'error' : '',
      disabled: isLoading }
    ), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      className: "toggle-password",
      onClick: () => setShowLoginPassword(!showLoginPassword),
      disabled: isLoading }, /*#__PURE__*/

    React.createElement(EyeIcon, null)
    )
    ),
    errors.loginPassword && /*#__PURE__*/React.createElement("span", { className: "error-message" }, errors.loginPassword)
    ), /*#__PURE__*/

    React.createElement("div", { className: "remember-me" }, /*#__PURE__*/
    React.createElement("label", null, /*#__PURE__*/
    React.createElement("input", {
      type: "checkbox",
      checked: rememberMe,
      onChange: (e) => setRememberMe(e.target.checked),
      disabled: isLoading }
    ), "Remember Me"

    )
    ), /*#__PURE__*/

    React.createElement(AuthButton, {
      isLoading: isLoading,
      loadingText: "Logging in..." },
    "Login"

    ), /*#__PURE__*/


    React.createElement("div", { className: "forgot-password-wrapper" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      onClick: () => setShowForgotPassword(true),
      className: "forgot-password-btn" },
    "Forgot your password?"

    )
    )
    ),


    showTwoFactorInput && /*#__PURE__*/
    React.createElement(TwoFactorVerification, {
      twoFactorCode: twoFactorCode,
      setTwoFactorCode: setTwoFactorCode,
      onSubmit: handleTwoFactorSubmit,
      isLoading: isLoading,
      error: errors.twoFactor,
      setErrors: setErrors }
    )

    )

    ), /*#__PURE__*/

    React.createElement("footer", { className: "signup-footer" }, /*#__PURE__*/
    React.createElement("div", { className: "footer-content" }, /*#__PURE__*/
    React.createElement("span", { className: "copyright" }, "Copyright 2021 - 2022 Feedo Inc. All rights Reserved"

    ), /*#__PURE__*/
    React.createElement(Link, { to: "/admin/login", className: "admin-login-link" }, "Admin Login"

    )
    )
    )
    ), /*#__PURE__*/

    React.createElement(ForgotPassword, {
      isOpen: showForgotPassword,
      onClose: () => setShowForgotPassword(false) }
    )
    ));

};

export default LoginSignup;