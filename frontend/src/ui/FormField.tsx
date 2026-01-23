import type { ReactNode } from 'react';

interface Props {
    label: string;
    children: ReactNode;
}

export default function FormField({ label, children }: Props) {
    return (
        <div>
            <label className="block text-ink-muted mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}
