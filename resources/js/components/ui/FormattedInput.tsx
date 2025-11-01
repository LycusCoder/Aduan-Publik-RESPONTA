import { ChangeEvent, InputHTMLAttributes, useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface FormattedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    formatType?: 'nik' | 'phone' | 'none';
    showValidation?: boolean;
}

const FormattedInput = ({ 
    label, 
    error,
    formatType = 'none',
    showValidation = false,
    id,
    name,
    placeholder,
    required = false,
    className = '',
    value,
    onChange,
    ...props 
}: FormattedInputProps) => {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [focused, setFocused] = useState(false);

    const formatNIK = (val: string): string => {
        // Remove all non-digits
        const digits = val.replace(/\D/g, '');
        // Limit to 16 digits
        const limited = digits.slice(0, 16);
        // Add dashes every 4 digits
        const formatted = limited.match(/.{1,4}/g)?.join('-') || limited;
        return formatted;
    };

    const formatPhone = (val: string): string => {
        // Remove all non-digits
        let digits = val.replace(/\D/g, '');
        
        // Handle international format +62
        if (digits.startsWith('62')) {
            digits = '0' + digits.slice(2);
        }
        
        // Ensure starts with 0
        if (!digits.startsWith('0') && digits.length > 0) {
            digits = '0' + digits;
        }
        
        // Limit to 13 digits (Indonesian phone numbers)
        return digits.slice(0, 13);
    };

    const validateNIK = (val: string): boolean => {
        const digits = val.replace(/\D/g, '');
        return digits.length === 16;
    };

    const validatePhone = (val: string): boolean => {
        const digits = val.replace(/\D/g, '');
        // Indonesian phone: starts with 08, length 10-13 digits
        return /^08\d{8,11}$/.test(digits);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        
        if (formatType === 'nik') {
            newValue = formatNIK(newValue);
            if (showValidation) {
                setIsValid(validateNIK(newValue));
            }
        } else if (formatType === 'phone') {
            newValue = formatPhone(newValue);
            if (showValidation) {
                setIsValid(validatePhone(newValue));
            }
        }
        
        // Create a new event with formatted value
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: newValue,
                name: e.target.name,
            },
        } as ChangeEvent<HTMLInputElement>;
        
        if (onChange) {
            onChange(syntheticEvent);
        }
    };

    useEffect(() => {
        if (value && showValidation && !focused) {
            const strValue = String(value);
            if (formatType === 'nik') {
                setIsValid(validateNIK(strValue));
            } else if (formatType === 'phone') {
                setIsValid(validatePhone(strValue));
            }
        }
    }, [value, formatType, showValidation, focused]);

    const getPlaceholder = (): string => {
        if (placeholder) return placeholder;
        if (formatType === 'nik') return 'XXXX-XXXX-XXXX-XXXX';
        if (formatType === 'phone') return '081234567890';
        return '';
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
                    type="text"
                    id={id}
                    name={name}
                    placeholder={getPlaceholder()}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        error ? 'border-red-500' : isValid === false ? 'border-yellow-500' : isValid === true ? 'border-green-500' : 'border-gray-300'
                    } ${showValidation ? 'pr-10' : ''} ${className}`}
                    {...props}
                />
                {showValidation && !focused && value && isValid !== null && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircleIcon className="h-5 w-5 text-yellow-500" />
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {!error && showValidation && !focused && value && isValid === false && (
                <p className="mt-1 text-xs text-yellow-600">
                    {formatType === 'nik' && 'NIK harus 16 digit angka'}
                    {formatType === 'phone' && 'Nomor HP harus dimulai dengan 08 dan terdiri dari 10-13 digit'}
                </p>
            )}
        </div>
    );
};

export default FormattedInput;