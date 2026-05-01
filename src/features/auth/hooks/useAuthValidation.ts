import { useCallback } from 'react';

import {
  type AuthMode,
  type FormData,
  type FormErrors,
} from '@/features/auth';

const calculatePasswordStrength = (password: string) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  return { score, requirements };
};

export const useAuthValidation = (
  formData: FormData,
  authMode: AuthMode,
) => {
  const validateField = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      let error = '';

      switch (field) {
        case 'name':
          if (typeof value === 'string' && authMode === 'signup' && !value.trim()) {
            error = 'Name is required';
          }
          break;

        case 'email':
          if (
            value === null ||
            value === undefined ||
            (typeof value === 'string' && !value.trim())
          ) {
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

        case 'agreeToTerms':
          if (authMode === 'signup' && !value) {
            error = 'You must agree to the terms and conditions';
          }
          break;
      }

      return error;
    },
    [formData.password, authMode],
  );

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof FormData)[] = authMode === 'reset' ? ['email'] : ['email', 'password'];

    if (authMode === 'signup') {
      fieldsToValidate.push('name', 'confirmPassword', 'agreeToTerms');
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    return newErrors;
  }, [authMode, formData, validateField]);

  return { validateField, validateForm };
};
