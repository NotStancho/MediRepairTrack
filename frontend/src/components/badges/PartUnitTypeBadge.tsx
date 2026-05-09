import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { PartUnitType } from '../../types/part/partUnitType';
import { PART_UNIT_TYPE_COLORS, getPartUnitTypeLabel } from '../../utils/partLabel';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: PartUnitType;
};

export default function PartUnitTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={PART_UNIT_TYPE_COLORS[type]} {...props}>
            {getPartUnitTypeLabel(type)}
        </Badge>
    );
}
