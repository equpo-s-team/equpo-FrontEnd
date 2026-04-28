import { AlertTriangle, KeyRound, Loader2, Mail } from 'lucide-react';
import React from 'react';

import { type FormData, type FormErrors } from '@/features/auth';
import { cn } from '@/lib/utils.ts';

interface ResetFormProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onFieldBlur: (field: keyof FormData) => void;
  onBackToLogin: () => void;
}

export const ResetForm: React.FC<ResetFormProps> = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onFieldBlur,
  onBackToLogin,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-right-5">
      <div className="text-center mb-6">
        <KeyRound className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-xl font-semibold mb-2">Recuperar contraseña</h3>
        <p className="text-gray-600 text-sm">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            onBlur={() => onFieldBlur('email')}
            className={cn(
              'w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all',
              errors.email ? 'border-red' : 'border-gray-200',
            )}
            aria-label="Correo electrónico"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red text-xs mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading ?? !formData.email}
        className={cn(
          'w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all',
          'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
          'disabled:opacity-50',
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <KeyRound className="h-5 w-5" />
              Enviar enlace
            </>
          )}
        </span>
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors"
        >
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
};
