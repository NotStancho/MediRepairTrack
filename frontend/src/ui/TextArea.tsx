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
                border rounded-lg
                outline-none
                resize-none

                bg-surface
                text-ink
                placeholder:text-ink-soft

                transition-[border-color,box-shadow,background-color]
                duration-150
                ease-out

                ${invalid
                ? 'border-danger focus:ring-2 focus:ring-danger-ring focus:border-danger'
                : 'border-border focus:ring-2 focus:ring-brand-ring focus:border-brand'}

                ${props.disabled ? 'bg-surface-muted text-ink-muted cursor-not-allowed' : ''}
                ${className}
            `}
        />
    );
}

