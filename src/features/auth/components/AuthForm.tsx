import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import {
  type AuthMode,
  type FormData,
  type FormErrors,
  type RegistrationStep,
} from '@/features/auth';
import { useAuthValidation } from '@/features/auth';
import { type AuthFormProps } from '@/features/auth/types/auth-types.ts';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth.ts';
import { cn } from '@/lib/utils/utils.ts';

import { CompleteForm } from './CompleteForm.tsx';
import { LoginForm } from './LoginForm.tsx';
import { ResetForm } from './ResetForm.tsx';
import { SignupForm } from './SignupForm.tsx';
import { VerifyEmailStep } from './VerifyEmailStep.tsx';

export const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  onClose,
  initialMode = 'login',
  className,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  const { validateField, validateForm } = useAuthValidation(formData, authMode);
  const { isLoading, loginWithEmail, signupWithEmail, loginWithGoogle, sendPasswordReset } =
    useFirebaseAuth();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && authMode === 'login') {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe }));
    }
  }, [authMode]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (fieldTouched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
      }
    },
    [fieldTouched, validateField],
  );

  const handleFieldBlur = useCallback(
    (field: keyof FormData) => {
      setFieldTouched((prev) => ({ ...prev, [field]: true }));
      const value = formData[field];
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
    },
    [formData, validateField],
  );

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setErrors({});
    const result = await loginWithGoogle();
    if (result.success && result.user) {
      toastSuccess('¡Bienvenido!');
      onSuccess?.({
        email: result.user.email ?? '',
        name: result.user.displayName ?? undefined,
      });
    } else if (result.error) {
      toastError(result.error);
    }
  };

  // ── Main Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // ── LOGIN ──
    if (authMode === 'login') {
      const result = await loginWithEmail(formData.email, formData.password);
      if (result.success && result.user) {
        if (formData.rememberMe) {
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('rememberMe');
        }
        toastSuccess('¡Inicio de sesión exitoso!');
        onSuccess?.({ email: formData.email });
      } else if (result.error) {
        toastError(result.error);
      }
      return;
    }

    // ── SIGNUP ──
    if (authMode === 'signup') {
      const result = await signupWithEmail(formData.email, formData.password, formData.name);
      if (result.success) {
        setRegistrationStep('verify');
        toastSuccess('¡Te enviamos un enlace de verificación a tu correo!');
      } else if (result.error) {
        toastError(result.error);
      }
      return;
    }

    // ── RESET ──
    if (authMode === 'reset') {
      const result = await sendPasswordReset(formData.email);
      if (result.success) {
        toastSuccess('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
        setTimeout(() => setAuthMode('login'), 3000);
      } else if (result.error) {
        toastError(result.error);
      }
    }
  };

  // ── Render sub-form ─────────────────────────────────────────────────────────
  const renderAuthContent = () => {
    if (authMode === 'reset') {
      return (
        <ResetForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onFieldBlur={handleFieldBlur}
          onBackToLogin={() => setAuthMode('login')}
        />
      );
    }

    if (authMode === 'signup' && registrationStep === 'verify') {
      return (
        <VerifyEmailStep
          email={formData.email}
          onVerified={() => {
            onSuccess?.({ email: formData.email, name: formData.name });
          }}
        />
      );
    }

    if (authMode === 'signup' && registrationStep === 'complete') {
      return <CompleteForm onClose={onClose} />;
    }

    if (authMode === 'login') {
      return (
        <LoginForm
          formData={formData}
          errors={errors}
          showPassword={showPassword}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onFieldBlur={handleFieldBlur}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onResetPassword={() => setAuthMode('reset')}
          onGoogleSignIn={handleGoogleSignIn}
        />
      );
    }

    return (
      <SignupForm
        formData={formData}
        errors={errors}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onFieldBlur={handleFieldBlur}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        onGoogleSignIn={() => {
          void handleGoogleSignIn();
        }}
      />
    );
  };

  return (
    <div
      className={cn('p-4', className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      {/* ── Heading ── */}
      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${authMode}`}
            id="auth-title"
            className="text-2xl font-bold mb-2 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {authMode === 'login'
              ? 'Bienvenido de nuevo'
              : authMode === 'reset'
                ? 'Recuperar contraseña'
                : 'Crear cuenta'}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${authMode}`}
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}
          >
            {authMode === 'login'
              ? 'Inicia sesión en tu cuenta'
              : authMode === 'reset'
                ? 'Te enviaremos un enlace de recuperación'
                : 'Crea una nueva cuenta'}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Login / Sign Up tabs ── */}
      {authMode !== 'reset' && registrationStep === 'details' && (
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
          <motion.button
            onClick={() => setAuthMode('login')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              authMode === 'login'
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
            )}
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Iniciar sesión
          </motion.button>
          <motion.button
            onClick={() => {
              setAuthMode('signup');
              setRegistrationStep('details');
            }}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              authMode === 'signup'
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
            )}
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Registrarse
          </motion.button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderAuthContent()}
          </motion.div>
        </AnimatePresence>
      </form>

      {authMode !== 'reset' && registrationStep === 'details' && (
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {authMode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-medium transition-colors"
            >
              {authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
