// ui/PhoneInput.tsx

import { useId, useState } from 'react';
import type { FocusEvent, InputHTMLAttributes } from 'react';

import Input from './Input';

import {
    extractPhoneLocalDigits,
    getPhoneValidationError,
    normalizePhoneNumber,
    formatPhoneLocalDigits,
    PHONE_COUNTRY_PREFIX,
    type PhoneValidationOptions,
} from '../utils/phone';

interface Props
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'>,
        PhoneValidationOptions {
    value: string;
    onChange: (value: string) => void;
    validate?: boolean;
    invalid?: boolean;
    error?: string;
    helperText?: string;
}

export default function PhoneInput({
    value,
    onChange,
    validate = false,
    invalid = false,
    error,
    helperText = 'Введіть 9 цифр, код +380 вже підставлений',
    required,
    requiredErrorMessage,
    invalidErrorMessage,
    onBlur,
    className = '',
    placeholder = '67 123 45 67',
    ...props
}: Props) {
    const [touched, setTouched] = useState(false);
    const descriptionId = useId();

    const localDigits = extractPhoneLocalDigits(value);
    const shouldValidate = validate || touched || localDigits.length > 0;
    const validationError = shouldValidate
        ? getPhoneValidationError(value, {
            required,
            requiredErrorMessage,
            invalidErrorMessage,
        })
        : undefined;

    const resolvedError = error ?? validationError;
    const isInvalid = invalid || !!resolvedError;
    const describedBy = [props['aria-describedby'], resolvedError || helperText ? descriptionId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        onBlur?.(event);
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="relative">
                <span
                    className={`
                        pointer-events-none absolute left-3 top-1/2 -translate-y-1/2
                        text-sm font-medium
                        ${isInvalid ? 'text-danger' : 'text-ink-muted'}
                    `}
                >
                    {PHONE_COUNTRY_PREFIX}
                </span>

                <Input
                    {...props}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={formatPhoneLocalDigits(localDigits)}
                    onChange={event => onChange(normalizePhoneNumber(event.target.value))}
                    onBlur={handleBlur}
                    invalid={isInvalid}
                    placeholder={placeholder}
                    className={`pl-[2.75rem] ${className}`}
                    aria-invalid={isInvalid || undefined}
                    aria-describedby={describedBy}
                />
            </div>

            {resolvedError && (
                <div id={descriptionId} className="text-xs text-danger">
                    {resolvedError}
                </div>
            )}

            {!resolvedError && helperText && (
                <div id={descriptionId} className="text-xs text-ink-muted">
                    {helperText}
                </div>
            )}
        </div>
    );
}
