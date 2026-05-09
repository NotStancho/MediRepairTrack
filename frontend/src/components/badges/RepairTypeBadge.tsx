import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { RepairType } from '../../types/claim/claim';
import { REPAIR_TYPE_COLORS, REPAIR_TYPE_LABELS } from '../../utils/claimLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: RepairType;
};

export default function RepairTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={REPAIR_TYPE_COLORS[type]} {...props}>
            {REPAIR_TYPE_LABELS[type]}
        </Badge>
    );
}
