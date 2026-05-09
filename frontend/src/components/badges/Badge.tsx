import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type BadgeSize = 'sm' | 'md';
type BadgeShape = 'rounded' | 'pill';

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

const shapeClasses: Record<BadgeShape, string> = {
    rounded: 'rounded',
    pill: 'rounded-full',
};

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
    children: ReactNode;
    colorClassName?: string;
    size?: BadgeSize;
    shape?: BadgeShape;
    mono?: boolean;
}

export default function Badge({
                                  children,
                                  colorClassName = 'bg-surface-muted text-ink-muted',
                                  size = 'sm',
                                  shape = 'pill',
                                  mono = false,
                                  className = '',
                                  ...props
                              }: BadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center font-medium',
                sizeClasses[size],
                shapeClasses[shape],
                colorClassName,
                mono ? 'font-mono' : '',
                className,
            ].filter(Boolean).join(' ')}
            {...props}
        >
            {children}
        </span>
    );
}
