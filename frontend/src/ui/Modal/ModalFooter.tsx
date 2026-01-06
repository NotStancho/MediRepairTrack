import type { ReactNode } from 'react';

export default function ModalFooter({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-end gap-2 pt-4">
            {children}
        </div>
    );
}
