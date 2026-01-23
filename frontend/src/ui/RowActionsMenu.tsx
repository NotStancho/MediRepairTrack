import { useEffect, useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useInteractions } from '@floating-ui/react';
import Portal from './Portal';

interface Props {
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function RowActionsMenu({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-end',
        middleware: [offset(6), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context); // клік поза + Escape
    const { getReferenceProps, getFloatingProps } = useInteractions([
        dismiss,
    ]);
    const setReferenceRef = (node: HTMLButtonElement | null) => {
        refs.setReference(node);
    };
    const setFloatingRef = (node: HTMLDivElement | null) => {
        refs.setFloating(node);
    };

    // Закриття при кліку поза / Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    if (!onEdit && !onDelete) return null;

    return (
        <>
            {/* Trigger */}
            <button
                ref={setReferenceRef}
                {...getReferenceProps()}
                onClick={() => {
                    setOpen(v => !v);
                }}
                className="
                    px-2 py-1
                    rounded
                    text-ink-muted
                    hover:bg-surface-muted
                    hover:text-ink
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring
                "
            >
                ⋯
            </button>

            {open && (
                <Portal>
                    <div
                        ref={setFloatingRef}
                        {...getFloatingProps()}
                        style={floatingStyles}
                        className="
                            z-50
                            w-36
                            bg-surface
                            border border-border
                            rounded-lg
                            shadow-lg shadow-black/10
                        "
                    >
                        {onEdit && (
                            <button
                                onClick={() => {
                                    onEdit();
                                    setOpen(false);
                                }}
                                className="
                                    w-full text-left
                                    px-3 py-2
                                    text-sm
                                    hover:bg-surface-muted
                                "
                            >
                                Редагувати
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => {
                                    onDelete();
                                    setOpen(false);
                                }}
                                className="
                                    w-full text-left
                                    px-3 py-2
                                    text-sm
                                    text-danger
                                    hover:bg-surface-muted
                                "
                            >
                                Видалити
                            </button>
                        )}
                    </div>
                </Portal>
            )}
        </>
    );
}
