import { AlertTriangle, Loader2, Mail } from 'lucide-react';
import React from 'react';

import { type FormData, type FormErrors } from '@/features/auth';
import { cn } from '@/lib/utils.ts';

interface VerificationFormProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onFieldBlur: (field: keyof FormData) => void;
  onBackToDetails: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onFieldBlur,
  onBackToDetails,
}) => {
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
              onInputChange('verificationCode', value);
            }}
            onBlur={() => onFieldBlur('verificationCode')}
            className={cn(
              'w-full text-center py-3 px-4 bg-white/50 border rounded-xl text-2xl font-mono tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all',
              errors.verificationCode ? 'border-red-500' : 'border-gray-200',
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
        disabled={isLoading ?? formData.verificationCode.length !== 6}
        className={cn(
          'w-full relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl transition-all',
          'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
          'disabled:opacity-50',
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify Email'}
        </span>
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToDetails}
          className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors"
        >
          Back to Details
        </button>
      </div>
    </div>
  );
};
