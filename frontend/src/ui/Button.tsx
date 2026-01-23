import * as React from 'react';

type Variant = 'default' | 'primary' | 'secondary' | 'danger';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

export default function Button({variant = 'default', disabled, className = '', children, ...props}: Props) {
    const base = `
        inline-flex items-center justify-center
        px-4 h-10
        text-sm font-semibold
        rounded-lg
        transition-[transform,box-shadow,background-color,border-color,color]
        duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring
        focus-visible:ring-offset-2 focus-visible:ring-offset-surface
        active:translate-y-[1px]
        disabled:cursor-not-allowed disabled:opacity-70
    `;

    const variants: Record<Variant, string> = {
        default: `
            bg-brand-soft text-brand-strong
            border border-transparent
            hover:bg-surface hover:border-brand-soft
            disabled:bg-surface-muted disabled:text-ink-muted
        `,
        primary: `
            bg-brand text-white
            shadow-sm shadow-black/10
            hover:bg-brand-strong
            disabled:bg-brand-muted disabled:text-white/70
        `,
        secondary: `
            bg-transparent text-ink
            border border-border
            hover:border-brand hover:text-brand
            hover:bg-brand-soft
            disabled:text-ink-muted disabled:border-border
        `,
        danger: `
            bg-danger text-white
            shadow-sm shadow-black/10
            hover:bg-danger-strong
            disabled:bg-danger-muted disabled:text-white/70
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
