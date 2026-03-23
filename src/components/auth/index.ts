export { AuthForm } from './components/AuthForm';
export { Component as AuthSwitch } from './components/AuthSwitch';

export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { ResetForm } from './components/ResetForm';
export { VerificationForm } from './components/VerificationForm';
export { CompleteForm } from './components/CompleteForm';

export { MarketingPanel } from './components/MarketingPanel';
export { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';

export { useAuthValidation } from './hooks/useAuthValidation';

export type {
  AuthMode,
  RegistrationStep,
  FormData,
  FormErrors,
  PasswordStrength
} from './types/auth-types';
