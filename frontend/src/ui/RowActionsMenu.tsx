import { useEffect, useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useInteractions } from '@floating-ui/react';
import Portal from './Portal';
import * as React from "react";

interface Action {
    label: string;
    onClick: () => void | Promise<void>;
    danger?: boolean;
}

interface Props {
    actions: Action[];
    trigger: React.ReactNode;
    disabled?: boolean;
}

export default function RowActionsMenu({ actions, trigger, disabled }: Props) {
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-end',
        middleware: [offset(6), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context); // клік поза + Escape
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

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

    if (!actions.length) return <>{trigger}</>;

    return (
        <>
            {/* Trigger */}
            <button
                ref={setReferenceRef}
                {...getReferenceProps()}
                onClick={(e) => {
                    e.stopPropagation();
                    if (disabled) return;
                    setOpen(v => !v);
                }}
            >
                {trigger}
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
                        <div className="py-1">
                            {actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        await action.onClick();
                                        setOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 text-sm transition
                                        hover:bg-surface-muted
                                        ${action.danger ? 'text-danger' : ''}
                                    `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}
