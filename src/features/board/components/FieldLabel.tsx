import React from 'react';

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label className="block text-xs font-semibold text-grey-600 mb-1.5 tracking-wide uppercase">
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  );
}
