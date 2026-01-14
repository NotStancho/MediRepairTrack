import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Input from './Input';
import * as React from "react";

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    invalid?: boolean;
    placeholder?: string;
}

export default function PasswordInput({value, onChange, invalid, placeholder }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                type={visible ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                invalid={invalid}
                placeholder={placeholder}
                className={value ? 'pr-10' : undefined}
            />

            {value && (
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600
                        transition-colors
                        "
                    tabIndex={-1}
                >
                    {visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
            )}
        </div>
    );
}
