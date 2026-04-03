export {AuthForm} from './components/AuthForm.tsx';
export {Component as AuthSwitch} from './components/AuthSwitch.tsx';

export {LoginForm} from './components/LoginForm.tsx';
export {SignupForm} from './components/SignupForm.tsx';
export {ResetForm} from './components/ResetForm.tsx';
export {VerificationForm} from './components/VerificationForm.tsx';
export {CompleteForm} from './components/CompleteForm.tsx';

export {MarketingPanel} from './components/MarketingPanel.tsx';
export {PasswordStrengthIndicator} from './components/PasswordStrengthIndicator.tsx';

export {useAuthValidation} from './hooks/useAuthValidation.ts';

export type {
    AuthMode,
    RegistrationStep,
    FormData,
    FormErrors,
    PasswordStrength
} from './types/auth-types.ts';
