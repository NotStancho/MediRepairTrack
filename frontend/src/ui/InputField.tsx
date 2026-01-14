import * as React from "react";

interface Props {
    label: string;
    required?: boolean;
    showRequired?: boolean;
    error?: string;
    helperText?: string;
    children?: React.ReactNode;
}

export default function InputField({label, required, showRequired, error, helperText, children }: Props) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">
                {label}
                {required && showRequired && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            {error && (
                <div className="text-xs text-red-600">
                    {error}
                </div>
            )}

            {children}

            {!error && helperText && (
                <div className="text-xs text-gray-500">
                    {helperText}
                </div>
            )}
        </div>
    );
}
