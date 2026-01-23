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
            <label className="text-sm text-ink-muted">
                {label}
                {required && showRequired && (
                    <span className="text-danger ml-1">*</span>
                )}
            </label>

            {error && (
                <div className="text-xs text-danger">
                    {error}
                </div>
            )}

            {children}

            {!error && helperText && (
                <div className="text-xs text-ink-muted">
                    {helperText}
                </div>
            )}
        </div>
    );
}
