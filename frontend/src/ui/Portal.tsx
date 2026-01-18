// ui/Portal.tsx
import { createPortal } from 'react-dom';
import { type ReactNode, useEffect, useState } from 'react';

interface Props {
    children: ReactNode;
}

export default function Portal({ children }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return createPortal(children, document.body);
}
