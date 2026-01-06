import { api } from './api';
import type { ClaimEmployee } from '../types/claimEmployee';
import type { AssignedActiveClaim } from '../types/assignedClaim';

export const getAssignedActiveClaims = async (employeeId: number) =>
    (await api.get<AssignedActiveClaim[]>(
        `/api/claim-employee/${employeeId}/claims/active`
    )).data;

export const getClaimEmployees = async (claimId: number) =>
    (await api.get<ClaimEmployee[]>(
        `/api/claim-employee/${claimId}/employees`
    )).data;
