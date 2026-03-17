import React from 'react';
import { Mail, Lock, Eye, EyeOff, User, Shield, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormData, FormErrors } from '@/components/auth';
import { PasswordStrengthIndicator } from '@/components/auth';

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
  onToggleConfirmPassword
}) => {
  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-right-5">
      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            onBlur={() => onFieldBlur('name')}
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

      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            onBlur={() => onFieldBlur('email')}
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
            onChange={(e) => onInputChange('password', e.target.value)}
            onBlur={() => onFieldBlur('password')}
            className={cn(
              "w-full pl-10 pr-12 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
              errors.password ? "border-red-500" : "border-gray-200"
            )}
            aria-label="Password"
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={onTogglePassword}
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
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      <div>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            onBlur={() => onFieldBlur('confirmPassword')}
            className={cn(
              "w-full pl-10 pr-12 py-3 bg-white/50 border rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all",
              errors.confirmPassword ? "border-red-500" : "border-gray-200"
            )}
            aria-label="Confirm Password"
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
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

      <div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            onBlur={() => onFieldBlur('phone')}
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

      <div className="flex items-center justify-between">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => onInputChange('agreeToTerms', e.target.checked)}
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
            'Create Account'
          )}
        </span>
      </button>
    </div>
  );
};
