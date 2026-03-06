'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,  
  Shield,
  AlertTriangle,
  KeyRound,
  Phone,
  Loader2,
  ArrowLeft,
  Users,
  Zap,
  CheckCircle,
} from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';
type RegistrationStep = 'details' | 'verification' | 'complete';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
  rememberMe: boolean;
  verificationCode: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  agreeToTerms?: string;
  rememberMe?: string;
  general?: string;
  verificationCode?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const feedback: string[] = [];

  if (!requirements.length) feedback.push('At least 8 characters');
  if (!requirements.uppercase) feedback.push('One uppercase letter');
  if (!requirements.lowercase) feedback.push('One lowercase letter');
  if (!requirements.number) feedback.push('One number');
  if (!requirements.special) feedback.push('One special character');

  return { score, feedback, requirements };
};

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'text-red-500';
    if (score <= 2) return 'text-orange-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2 animate-in fade-in-50 slide-in-from-bottom-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(strength.score)} bg-current rounded-full`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 min-w-[60px]">
          {getStrengthText(strength.score)}
        </span>
      </div>
      {strength.feedback.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          {strength.feedback.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs text-amber-500"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AuthForm: React.FC<{
  onSuccess?: (userData: { email: string; name?: string }) => void;
  onClose?: () => void;
  initialMode?: AuthMode;
  className?: string;
}> = ({ onSuccess, onClose, initialMode = 'login', className }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    rememberMe: false,
    verificationCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && authMode === 'login') {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe }));
    }
  }, [authMode]);

  const validateField = useCallback((field: keyof FormData, value: string | boolean) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (typeof value === 'string' && authMode === 'signup' && !value.trim()) {
          error = 'Name is required';
        }
        break;
        
      case 'email':
        if (!value || (typeof value === 'string' && !value.trim())) {
          error = 'Email is required';
        } else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (typeof value === 'string') {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters';
          } else if (authMode === 'signup') {
            const strength = calculatePasswordStrength(value);
            if (strength.score < 3) {
              error = 'Password is too weak';
            }
          }
        }
        break;
        
      case 'confirmPassword':
        if (authMode === 'signup' && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
        
      case 'phone':
        if (typeof value === 'string' && value && !/^\+?[\d\s\-()]+$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'verificationCode':
        if (typeof value === 'string' && authMode === 'signup' && registrationStep === 'verification' && !/^\d{6}$/.test(value)) {
          error = 'Verification code must be 6 digits';
        }
        break;
        
      case 'agreeToTerms':
        if (authMode === 'signup' && !value) {
          error = 'You must agree to the terms and conditions';
        }
        break;
    }
    
    return error;
  }, [formData.password, authMode, registrationStep]);

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (fieldTouched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [fieldTouched, validateField]);

  const handleFieldBlur = useCallback((field: keyof FormData) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field];
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [formData, validateField]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof FormData)[] = ['email', 'password'];
    
    if (authMode === 'signup') {
      fieldsToValidate.push('name', 'confirmPassword', 'agreeToTerms');
    }
    
    if (registrationStep === 'verification') {
      fieldsToValidate.push('verificationCode');
    }

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [authMode, registrationStep, formData, validateField]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (authMode === 'login') {
        if (formData.rememberMe) {
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
        }
        
        setSuccessMessage('Login successful');
        onSuccess?.({ email: formData.email });
        
      } else if (authMode === 'signup') {
        if (registrationStep === 'details') {
          setRegistrationStep('verification');
          setSuccessMessage('Account created! Please verify your email.');
        } else if (registrationStep === 'verification') {
          setRegistrationStep('complete');
          setSuccessMessage('Email verified successfully!');
          onSuccess?.({ email: formData.email, name: formData.name });
        }
        
      } else if (authMode === 'reset') {
        setSuccessMessage('Password reset email sent!');
        setTimeout(() => setAuthMode('login'), 2000);
      }
      
    } catch (error) {
      setErrors({ 
        general: 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthContent = () => {
    if (authMode === 'reset') {
      return (
        <div className="space-y-4 animate-in fade-in-50 slide-in-from-right-5">
          <div className="text-center mb-6">
            <KeyRound className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Password Recovery</h3>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                  errors.email ? "border-red-500" : "border-gray-200"
                )}
                aria-label="Email Address"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.email}
            className={cn(
              "w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all",
              "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
              "disabled:opacity-50"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  Send Reset Link
                </>
              )}
            </span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }

    if (authMode === 'signup' && registrationStep === 'verification') {
      return (
        <div className="space-y-4 animate-in fade-in-50 slide-in-from-right-5">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Verify Your Email</h3>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to <span className="font-medium">{formData.email}</span>
            </p>
          </div>

          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={formData.verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  handleInputChange('verificationCode', value);
                }}
                onBlur={() => handleFieldBlur('verificationCode')}
                className={cn(
                  "w-full text-center py-3 px-4 bg-white/50 border rounded-xl text-2xl font-mono tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                  errors.verificationCode ? "border-red-500" : "border-gray-200"
                )}
                maxLength={6}
                aria-label="Verification Code"
                aria-describedby={errors.verificationCode ? 'code-error' : undefined}
              />
              {errors.verificationCode && (
                <p
                  id="code-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1 justify-center"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {errors.verificationCode}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.verificationCode.length !== 6}
            className={cn(
              "w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all",
              "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
              "disabled:opacity-50"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Email"}
            </span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setRegistrationStep('details')}
              className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors"
            >
              Back to Details
            </button>
          </div>
        </div>
      );
    }

    if (authMode === 'signup' && registrationStep === 'complete') {
      return (
        <div className="text-center space-y-6 animate-in fade-in-50 slide-in-from-right-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">Welcome Aboard!</h3>
            <p className="text-gray-600">
              Your account has been created successfully.
            </p>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl",
              "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            )}
          >
            Get Started
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in-50 slide-in-from-right-5">
        {authMode === 'signup' && (
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                  errors.name ? "border-red-500" : "border-gray-200"
                )}
                aria-label="Full Name"
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                errors.email ? "border-red-500" : "border-gray-200"
              )}
              aria-label="Email Address"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleFieldBlur('password')}
              className={cn(
                "w-full pl-10 pr-12 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                errors.password ? "border-red-500" : "border-gray-200"
              )}
              aria-label="Password"
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {errors.password && (
              <p
                id="password-error"
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>
          {authMode === 'signup' && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </div>

        {authMode === 'signup' && (
          <div>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleFieldBlur('confirmPassword')}
                className={cn(
                  "w-full pl-10 pr-12 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                )}
                aria-label="Confirm Password"
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {authMode === 'signup' && (
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleFieldBlur('phone')}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
                  errors.phone ? "border-red-500" : "border-gray-200"
                )}
                aria-label="Phone Number"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {authMode === 'login' ? (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  aria-label="Remember me"
                  className="w-4 h-4 rounded border-gray-300 bg-white text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setAuthMode('reset')}
                className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 bg-white text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0"
                aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-emerald-500 hover:underline transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-emerald-500 hover:underline transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>
          )}
        </div>

        {errors.agreeToTerms && (
          <p
            id="terms-error"
            className="text-red-500 text-xs flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            {errors.agreeToTerms}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all",
            "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            "disabled:opacity-50"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div 
      className={cn("p-4", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-5">
          <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-700 text-sm">{successMessage}</span>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-red-500 text-sm">{errors.general}</span>
        </div>
      )}

      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={`title-${authMode}`}
            id="auth-title"
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {authMode === 'login' ? 'Welcome Back' : 
             authMode === 'reset' ? 'Reset Password' : 'Create Account'}
          </motion.h2>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={`desc-${authMode}`}
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
          >
            {authMode === 'login' ? 'Sign in to your account' : 
             authMode === 'reset' ? 'Recover your account access' :
             'Create a new account'}
          </motion.p>
        </AnimatePresence>
      </div>

      {authMode !== 'reset' && (
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <motion.button
            onClick={() => setAuthMode('login')}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
              authMode === 'login'
                ? "bg-white text-gray-800 shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            )}
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => {
              setAuthMode('signup');
              setRegistrationStep('details');
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
              authMode === 'signup'
                ? "bg-white text-gray-800 shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            )}
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up
          </motion.button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderAuthContent()}
          </motion.div>
        </AnimatePresence>
      </form>

      {authMode !== 'reset' && registrationStep === 'details' && (
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export const Component = () => {
  const [isClosing, setIsClosing] = React.useState(false);

  const goBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <AnimatePresence mode="wait">
      {!isClosing && (
        <motion.div
          key="auth-modal"
          className="min-h-screen relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 animated-gradient-bg" />
          
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-radial-green opacity-40 animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-radial-blue opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={goBack}
            className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </motion.button>
          
          <div className="relative z-10 h-screen w-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-[85vw] max-w-6xl h-[85vh]"
            >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full">
            <div className="flex h-full">
              <div className="w-2/5 p-12 flex flex-col justify-center relative">
                <motion.h1 
                  className="text-8xl font-maxwell tracking-tight text-white mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  eq<span className="text-emerald-400">u</span>po
                </motion.h1>
                <motion.p 
                  className="text-xl text-white/80 mb-12"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  La nueva era de la colaboración
                </motion.p>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Trabajo en equipo</h3>
                      <p className="text-white/70">Colabora sin límites</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Productividad</h3>
                      <p className="text-white/70">10x más eficiente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Resultados</h3>
                      <p className="text-white/70">Impacto medible</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
              
              <div className="w-3/5 bg-white/95 backdrop-blur-xl p-16 h-full overflow-y-auto">
                <AuthForm 
                  onSuccess={(userData) => {
                    console.log('Authentication successful:', userData);
                    window.location.href = '/dashboard';
                  }}
                  onClose={() => {
                    console.log('Auth form closed');
                    goBack();
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Component;
