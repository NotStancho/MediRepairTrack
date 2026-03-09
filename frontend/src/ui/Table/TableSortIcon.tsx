// ui/Table/TableSortIcon.tsx
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

interface Props {
    direction: false | 'asc' | 'desc';
}

export default function TableSortIcon({ direction }: Props) {
    if (direction === 'asc') return <FiArrowUp className="ml-1 shrink-0 text-ink-soft" />;
    if (direction === 'desc') return <FiArrowDown className="ml-1 shrink-0 text-ink-soft" />;
    return <FiMinus className="ml-1 shrink-0 text-ink-soft opacity-50" />;
}
