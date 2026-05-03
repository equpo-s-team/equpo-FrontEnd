import { AlertTriangle, Eye, EyeOff, Loader2, Lock, Mail, Shield, User } from 'lucide-react';
import React from 'react';

import { type FormData, type FormErrors } from '@/features/auth';
import { PasswordStrengthIndicator } from '@/features/auth';
import { cn } from '@/lib/utils/utils.ts';

// Google icon SVG (same as LoginForm)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface SignupFormProps {
  formData: FormData;
  errors: FormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onFieldBlur: (field: keyof FormData) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onGoogleSignIn: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  isLoading,
  onInputChange,
  onFieldBlur,
  onTogglePassword,
  onToggleConfirmPassword,
  onGoogleSignIn,
}) => {
  return (
    <div className="space-y-2.5 animate-in fade-in-50 slide-in-from-right-5">
      {/* ── Google button ── */}
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className={cn(
          'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800',
          'text-gray-700 dark:text-gray-200 font-medium text-sm transition-all',
          'hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <GoogleIcon />
        Registrarse con Google
      </button>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">O con correo electrónico</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
      </div>

      {/* ── Full Name ── */}
      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            onBlur={() => onFieldBlur('name')}
            className={cn(
              'w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all dark:text-white',
              errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600',
            )}
            aria-label="Nombre completo"
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </div>
        {errors.name && (
          <p id="name-error" className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* ── Email ── */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            onBlur={() => onFieldBlur('email')}
            className={cn(
              'w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all dark:text-white',
              errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600',
            )}
            aria-label="Correo electrónico"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* ── Password ── */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            onBlur={() => onFieldBlur('password')}
            className={cn(
              'w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all dark:text-white',
              errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600',
            )}
            aria-label="Contraseña"
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.password}
          </p>
        )}
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      {/* ── Confirm Password ── */}
      <div>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            onBlur={() => onFieldBlur('confirmPassword')}
            className={cn(
              'w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all dark:text-white',
              errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600',
            )}
            aria-label="Confirmar contraseña"
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* ── Terms ── */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => onInputChange('agreeToTerms', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0"
            aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Acepto los{' '}
            <a href="#" className="text-emerald-500 dark:text-emerald-400 hover:underline transition-colors">
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-emerald-500 dark:text-emerald-400 hover:underline transition-colors">
              Política de Privacidad
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p id="terms-error" className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.agreeToTerms}
          </p>
        )}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all',
          'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear cuenta'}
        </span>
      </button>
    </div>
  );
};
