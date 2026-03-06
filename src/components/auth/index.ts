// Main components
export { AuthForm } from './components/AuthForm';
export { Component as AuthSwitch } from './components/AuthSwitch';

// Form components
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { ResetForm } from './components/ResetForm';
export { VerificationForm } from './components/VerificationForm';
export { CompleteForm } from './components/CompleteForm';

// Utility components
export { MarketingPanel } from './components/MarketingPanel';
export { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';

// Hooks
export { useAuthValidation } from './hooks/useAuthValidation';

// Types
export type {
  AuthMode,
  RegistrationStep,
  FormData,
  FormErrors,
  PasswordStrength
} from './types/auth-types';
