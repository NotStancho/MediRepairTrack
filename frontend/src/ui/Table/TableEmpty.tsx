// ui/Table/TableEmpty.tsx
import type { ReactNode } from 'react';

interface Props {
    title?: string;
    description?: string;
    action?: ReactNode;
}

export default function TableEmpty({ title = 'Немає даних', description = 'Спробуйте змінити фільтри або додати новий запис.', action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center text-ink-muted">
            <div className="text-sm font-semibold text-ink">{title}</div>
            {description && <div className="text-xs">{description}</div>}
            {action}
        </div>
    );
}
