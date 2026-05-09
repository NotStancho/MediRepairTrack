import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { PaymentStatus } from '../../types/payment';
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../../utils/paymentLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: PaymentStatus;
};

export default function PaymentStatusBadge({ status, ...props }: Props) {
    return (
        <Badge colorClassName={PAYMENT_STATUS_COLORS[status]} {...props}>
            {PAYMENT_STATUS_LABELS[status]}
        </Badge>
    );
}
