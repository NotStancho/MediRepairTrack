// api/claimEmployee

import { api } from './api';

import type { ClaimEmployee } from '../types/claimEmployee';
import type { AssignedActiveClaim } from '../types/claim/assignedClaim';
import type { EmployeeShort } from '../types/employee/employee';
import type {
    AssignEmployeeToClaimPayload,
    UpdateClaimEmployeePayload,
} from '../types/claim/claimEmployeePayloads';

export const getAssignedActiveClaims = async (employeeId: number) =>
    (await api.get<AssignedActiveClaim[]>(
        `/api/claim-employee/${employeeId}/claims/active`,
    )).data;

export const getClaimEmployees = async (claimId: number) =>
    (await api.get<ClaimEmployee[]>(
        `/api/claim-employee/${claimId}/employees`,
    )).data;

export const getAssignableClaimEmployees = async (
    claimId: number,
    performedByEmployeeId: number,
) =>
    (await api.get<EmployeeShort[]>(
        `/api/claim-employee/${claimId}/assignable-employees`,
        { params: { performedByEmployeeId } },
    )).data;

export const assignEmployeeToClaim = async (
    claimId: number,
    payload: AssignEmployeeToClaimPayload,
) =>
    (await api.post<ClaimEmployee>(
        `/api/claim-employee/${claimId}/employees`,
        payload,
    )).data;

export const updateClaimEmployee = async (
    claimId: number,
    employeeId: number,
    payload: UpdateClaimEmployeePayload,
) =>
    (await api.put<ClaimEmployee>(
        `/api/claim-employee/${claimId}/employees/${employeeId}`,
        payload,
    )).data;

export const deleteClaimEmployee = async (
    claimId: number,
    employeeId: number,
    performedByEmployeeId: number,
) => {
    await api.delete(`/api/claim-employee/${claimId}/employees/${employeeId}`, {
        params: { performedByEmployeeId },
    });
};
