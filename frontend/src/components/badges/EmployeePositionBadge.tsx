import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { EmployeePosition } from '../../types/employee/employee';
import { EMPLOYEE_POSITION_COLORS, EMPLOYEE_POSITION_LABELS } from '../../utils/employeeLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    position: EmployeePosition;
};

export default function EmployeePositionBadge({ position, ...props }: Props) {
    return (
        <Badge colorClassName={EMPLOYEE_POSITION_COLORS[position]} {...props}>
            {EMPLOYEE_POSITION_LABELS[position]}
        </Badge>
    );
}
