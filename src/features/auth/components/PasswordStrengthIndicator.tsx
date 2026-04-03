import React from 'react';
import {AlertTriangle} from 'lucide-react';
import {PasswordStrength} from '../types/auth-types.ts';

const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const feedback: string[] = [];

    if (!requirements.length) feedback.push('At least 8 characters');
    if (!requirements.uppercase) feedback.push('One uppercase letter');
    if (!requirements.lowercase) feedback.push('One lowercase letter');
    if (!requirements.number) feedback.push('One number');
    if (!requirements.special) feedback.push('One special character');

    return {score, feedback, requirements};
};

interface PasswordStrengthIndicatorProps {
    password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({password}) => {
    const strength = calculatePasswordStrength(password);

    const getStrengthColor = (score: number) => {
        if (score <= 1) return 'text-red-500';
        if (score <= 2) return 'text-orange-500';
        if (score <= 3) return 'text-yellow-500';
        if (score <= 4) return 'text-blue-500';
        return 'text-emerald-500';
    };

    const getStrengthText = (score: number) => {
        if (score <= 1) return 'Very Weak';
        if (score <= 2) return 'Weak';
        if (score <= 3) return 'Fair';
        if (score <= 4) return 'Good';
        return 'Strong';
    };

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2 animate-in fade-in-50 slide-in-from-bottom-1">
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full ${getStrengthColor(strength.score)} bg-current rounded-full`}
                        style={{width: `${(strength.score / 5) * 100}%`}}
                    />
                </div>
                <span className="text-xs text-gray-500 min-w-[60px]">
          {getStrengthText(strength.score)}
        </span>
            </div>
            {strength.feedback.length > 0 && (
                <div className="grid grid-cols-2 gap-1">
                    {strength.feedback.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 text-xs text-amber-500"
                        >
                            <AlertTriangle className="h-3 w-3"/>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
