import { useState, ChangeEvent, InputHTMLAttributes } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    showStrength?: boolean;
}

const PasswordInput = ({ 
    label, 
    error,
    showStrength = false,
    id,
    name,
    placeholder,
    required = false,
    className = '',
    value,
    onChange,
    ...props 
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const calculateStrength = (password: string): number => {
        let score = 0;
        if (!password) return 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        return Math.min(score, 4);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (showStrength) {
            setStrength(calculateStrength(newValue));
        }
        if (onChange) {
            onChange(e);
        }
    };

    const getStrengthColor = (): string => {
        switch (strength) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthText = (): string => {
        switch (strength) {
            case 1: return 'Lemah';
            case 2: return 'Cukup';
            case 3: return 'Bagus';
            case 4: return 'Kuat';
            default: return '';
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    data-testid="toggle-password-visibility"
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                        <EyeIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
            
            {showStrength && value && (
                <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                    level <= strength ? getStrengthColor() : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                    {strength > 0 && (
                        <p className="text-xs text-gray-600">
                            Kekuatan password: <span className="font-medium">{getStrengthText()}</span>
                        </p>
                    )}
                </div>
            )}
            
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default PasswordInput;