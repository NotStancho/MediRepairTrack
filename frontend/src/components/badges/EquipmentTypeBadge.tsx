import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { EquipmentType } from '../../types/equipmentModel/equipmentType';
import { EQUIPMENT_TYPE_COLORS, getEquipmentTypeLabel } from '../../utils/equipmentLabel';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: EquipmentType;
};

export default function EquipmentTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={EQUIPMENT_TYPE_COLORS[type]} {...props}>
            {getEquipmentTypeLabel(type)}
        </Badge>
    );
}
