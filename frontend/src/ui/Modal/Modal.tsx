import {type ReactNode, useEffect} from 'react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    width?: 'sm' | 'md' | 'lg';
}

const WIDTHS = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export default function Modal({
                                  title,
                                  children,
                                  onClose,
                                  width = 'md',
                              }: ModalProps) {

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* modal */}
            <div
                className={`relative z-10 w-full ${WIDTHS[width]} bg-white rounded-lg shadow p-5 space-y-4`}
                onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
