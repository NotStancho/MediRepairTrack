import { useEffect, useRef, useState } from 'react';

interface Props {
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function RowActionsMenu({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // 🔒 закриття при кліку поза / Escape
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    if (!onEdit && !onDelete) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="
                    px-2 py-1
                    rounded
                    hover:bg-gray-100
                    text-gray-600
                    focus:outline-none
                "
            >
                ⋯
            </button>

            {open && (
                <div
                    className="
                        absolute right-0 mt-1 w-32
                        bg-white
                        border border-gray-200
                        rounded-md
                        shadow-md
                        z-10
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
                                hover:bg-gray-50
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
                                text-red-600
                                hover:bg-gray-50
                            "
                        >
                            Видалити
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
