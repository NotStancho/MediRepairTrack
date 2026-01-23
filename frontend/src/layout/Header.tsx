import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type {AuthUser} from "../types/auth";
import { FiChevronDown } from 'react-icons/fi';


export default function Header() {
    const { user, signOut } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    function getCabinetTitle(user: AuthUser) {
        if (user.role === 'CLIENT') return 'Особистий кабінет клієнта';

        if (user.role === 'EMPLOYEE') {
            switch (user.position) {
                case 'MANAGER':
                    return 'Кабінет менеджера';
                case 'SERVICE_ENGINEER':
                    return 'Кабінет сервісного інженера';
                default:
                    return 'Кабінет працівника';
            }
        }

        if (user.role === 'ADMIN') return 'Кабінет адміністратора';

        return '';
    }


    // Закриття dropdown: клік поза + Escape
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

    if (!user) return null;

    return (
        <header className="h-14 bg-white/80 backdrop-blur border-b border-border flex items-center px-4 z-30 shadow-sm shadow-black/5">
            <div className="font-medium text-ink">
                {getCabinetTitle(user)}
            </div>

            {/* spacer */}
            <div className="flex-1" />

            {/* user */}
            <div className="relative" ref={ref}>
                <button
                    onClick={() => setOpen(v => !v)}
                    className="
                        flex items-center gap-2
                        text-sm text-ink
                        px-3 py-1.5
                        rounded-md
                        hover:bg-brand-soft
                        focus:outline-none focus:ring-2 focus:ring-brand-ring
                        transition
                    "
                >
                    <span className="font-medium">
                        {user.lastName} {user.firstName}
                    </span>

                    <FiChevronDown
                        size={16}
                        className={`
                            text-ink-muted
                            transition-transform duration-200
                            ${open ? 'rotate-180' : ''}
                        `}
                    />
                </button>

                {open && (
                    <div
                        className="
                            absolute right-0 mt-1 w-44
                            bg-surface
                            border border-border
                            rounded-lg
                            shadow-lg shadow-black/10
                        "
                    >
                        <button
                            onClick={signOut}
                            className="
                                w-full text-left
                                px-4 py-2
                                text-sm text-ink
                                hover:bg-surface-muted
                            "
                        >
                            Вийти
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
