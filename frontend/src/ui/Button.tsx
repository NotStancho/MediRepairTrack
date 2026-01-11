import * as React from 'react';

type Variant = 'default' | 'primary' | 'secondary';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

export default function Button({variant = 'default', disabled, className = '', children, ...props}: Props) {
    const base = `
        inline-flex items-center justify-center
        px-3 h-8
        text-sm font-medium
        rounded
        transition-colors
        focus:outline-none
    `;

    const variants: Record<Variant, string> = {
        default: `
            bg-[#78A5C2] text-white
            hover:bg-white hover:text-[#78A5C2] hover:border hover:border-[#78A5C2]
            disabled:bg-[#C7D8E4] disabled:text-white/60
        `,
        primary: `
            bg-[#009A31] text-white font-bold
            hover:bg-[#007A27]
            disabled:bg-[#B7E2C6] disabled:text-white/60
        `,
        secondary: `
            border border-black text-black
            hover:border-gray-700 hover:text-gray-700
            disabled:border-gray-300 disabled:text-gray-400
        `,
    };

    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                ${base}
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
