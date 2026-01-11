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
                  w-full h-8 px-3 text-sm
                  border rounded
                  outline-none
                  transition
        
                  placeholder:text-gray-400
                  placeholder:font-normal
        
                  ${invalid
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'}
        
                  ${props.disabled
                            ? 'bg-gray-100 cursor-not-allowed placeholder:text-gray-300'
                            : 'bg-white'}
        
                  ${className}
                `}
            />
        );
    }
);

export default Input;
