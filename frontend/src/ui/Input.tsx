import {forwardRef} from 'react';
import * as React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ className = '', invalid, ...props }, ref) => {
        return (
            <input
                ref={ref}
                {...props}
                className={`
                  w-full h-10 px-3 text-sm
                  border rounded-lg
                  outline-none
                  transition-[border-color,box-shadow,background-color]

                  bg-surface
                  text-ink
                  placeholder:text-ink-soft

                  ${invalid
                            ? 'border-danger focus:ring-2 focus:ring-danger-ring focus:border-danger'
                            : 'border-border focus:ring-2 focus:ring-brand-ring focus:border-brand'}

                  ${props.disabled
                            ? 'bg-surface-muted text-ink-muted cursor-not-allowed'
                            : ''}

                  ${className}
                `}
            />
        );
    }
);

export default Input;
