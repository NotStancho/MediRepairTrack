// ui/TextArea.tsx
import * as React from 'react';
import {useLayoutEffect, useRef} from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
    rows?: number;
    maxHeight?: number; // px
}

export default function TextArea({invalid, className = '', rows = 3, maxHeight = 256, value, ...props}: Props) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        // reset height to recalc scrollHeight correctly
        el.style.height = 'auto';

        const newHeight = Math.min(el.scrollHeight, maxHeight);
        el.style.height = `${newHeight}px`;
        el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';

    }, [value, maxHeight]);

    return (
        <textarea
            ref={ref}
            rows={rows}
            value={value}
            {...props}
            className={`
                min-h-18
                w-full px-3 py-2 text-sm
                border rounded
                outline-none
                resize-none
                
                placeholder:text-gray-400
                placeholder:font-normal
                
                transition-[border, box-shadow]
                duration-150
                ease-out
                
                ${invalid
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'}

                ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                ${className}
            `}
        />
    );
}

