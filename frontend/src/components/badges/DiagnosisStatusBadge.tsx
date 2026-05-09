import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { DiagnosisStatus } from '../../types/diagnosis/diagnosis';
import { DIAGNOSIS_STATUS_COLORS, DIAGNOSIS_STATUS_LABELS } from '../../utils/diagnosisLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: DiagnosisStatus;
    children?: BadgeProps['children'];
};

export default function DiagnosisStatusBadge({ status, children, ...props }: Props) {
    return (
        <Badge colorClassName={DIAGNOSIS_STATUS_COLORS[status]} {...props}>
            {children ?? DIAGNOSIS_STATUS_LABELS[status]}
        </Badge>
    );
}
