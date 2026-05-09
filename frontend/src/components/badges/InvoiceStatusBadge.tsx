import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { InvoiceStatus } from '../../types/invoice';
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from '../../utils/invoiceLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: InvoiceStatus;
    children?: BadgeProps['children'];
};

export default function InvoiceStatusBadge({ status, children, ...props }: Props) {
    return (
        <Badge colorClassName={INVOICE_STATUS_COLORS[status]} {...props}>
            {children ?? INVOICE_STATUS_LABELS[status]}
        </Badge>
    );
}
