import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { DeliveryStatus } from '../../types/delivery';
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUS_LABELS } from '../../utils/deliveryLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: DeliveryStatus;
};

export default function DeliveryStatusBadge({ status, ...props }: Props) {
    return (
        <Badge colorClassName={DELIVERY_STATUS_COLORS[status]} {...props}>
            {DELIVERY_STATUS_LABELS[status]}
        </Badge>
    );
}
