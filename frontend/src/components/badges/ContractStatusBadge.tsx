import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { ContractStatus } from '../../types/clientContract/contractStatus';
import { CONTRACT_STATUS_COLORS, getContractStatusLabel } from '../../utils/clientContractLabel';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: ContractStatus;
};

export default function ContractStatusBadge({ status, ...props }: Props) {
    return (
        <Badge colorClassName={CONTRACT_STATUS_COLORS[status]} {...props}>
            {getContractStatusLabel(status)}
        </Badge>
    );
}
