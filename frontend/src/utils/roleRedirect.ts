import type { AuthUser } from '../types/auth';

export function getHomeRoute(user: AuthUser): string {
    if (user.role === 'CLIENT') {
        return '/client';
    }

    if (user.role === 'EMPLOYEE') {
        if (user.position === 'SERVICE_ENGINEER') {
            return '/employee/claims';
        }
        // MANAGER
        return '/claims';
    }

    if (user.role === 'ADMIN') {
        return '/claims';
    }

    return '/login';
}
