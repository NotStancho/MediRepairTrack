import type { BadgeProps } from './Badge';
import Badge from './Badge';
import type { ComplexityLevelShort } from '../../types/diagnosis/DSS/complexityLevel';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    level: ComplexityLevelShort;
};

const COMPLEXITY_COLORS: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
};

function getComplexityColor(name: string) {
    const normalized = name.trim().toLowerCase();

    if (['низька', 'низький', 'low'].includes(normalized)) {
        return COMPLEXITY_COLORS.low;
    }

    if (['середня', 'середній', 'medium'].includes(normalized)) {
        return COMPLEXITY_COLORS.medium;
    }

    if (['висока', 'високий', 'high'].includes(normalized)) {
        return COMPLEXITY_COLORS.high;
    }

    if (['критична', 'критичний', 'critical'].includes(normalized)) {
        return COMPLEXITY_COLORS.critical;
    }

    return 'bg-surface text-ink-muted border border-border';
}

export default function ComplexityLevelBadge({ level, ...props }: Props) {
    return (
        <Badge colorClassName={getComplexityColor(level.name)} {...props}>
            {level.name}
        </Badge>
    );
}
