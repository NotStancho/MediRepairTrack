import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { DeliveryType } from '../../types/delivery';
import { DELIVERY_TYPE_COLORS, DELIVERY_TYPE_LABELS } from '../../utils/deliveryLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: DeliveryType;
};

export default function DeliveryTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={DELIVERY_TYPE_COLORS[type]} {...props}>
            {DELIVERY_TYPE_LABELS[type]}
        </Badge>
    );
}
