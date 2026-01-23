import {type ReactNode, useEffect} from 'react';
import Portal from '../Portal';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    width?: 'sm' | 'md' | 'lg';

    backdrop?: 'none' | 'dim' | 'blur';
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
                                  backdrop = 'blur'
                              }: ModalProps) {

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const backdropClass =
        backdrop === 'none'
            ? ''
            : backdrop === 'dim'
                ? 'bg-black/40'
                : 'bg-black/40 backdrop-blur-xs';

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* overlay */}
                {backdrop !== 'none' && (
                    <div
                        className={`absolute inset-0 ${backdropClass}`}
                        onClick={onClose}
                    />
                )}

                {/* modal */}
                <div
                    className={`relative z-10 w-full ${WIDTHS[width]} bg-surface rounded-2xl border border-border shadow-xl shadow-black/10 p-5 space-y-4`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-ink">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-ink-soft hover:text-ink transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {children}
                </div>
            </div>
        </Portal>
    );
}
