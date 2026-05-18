import React from 'react';

import { cn } from '@/lib/utils/utils.ts';

interface CompleteFormProps {
  onClose?: () => void;
}

export const CompleteForm: React.FC<CompleteFormProps> = ({ onClose }) => {
  return (
    <div className="text-center space-y-6 animate-in fade-in-50 slide-in-from-right-5">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-2">Welcome Aboard!</h3>
        <p className="text-gray-600">Your account has been created successfully.</p>
      </div>

      <button
        onClick={onClose}
        className={cn(
          'w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl',
          'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
        )}
      >
        Get Started
      </button>
    </div>
  );
};
