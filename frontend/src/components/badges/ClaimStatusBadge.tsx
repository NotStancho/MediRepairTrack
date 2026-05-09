import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { ClaimStatus } from '../../types/claim/claim';
import { CLAIM_STATUS_LABELS, STATUS_COLORS } from '../../utils/claimLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: ClaimStatus;
};

export default function ClaimStatusBadge({ status, ...props }: Props) {
    return (
        <Badge colorClassName={STATUS_COLORS[status]} {...props}>
            {CLAIM_STATUS_LABELS[status]}
        </Badge>
    );
}
