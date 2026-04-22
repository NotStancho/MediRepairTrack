// api/employee.ts

import { api } from './api';
import type {
    Employee,
    EmployeeFull,
} from '../types/employee/employee';

import type {
    RegisterEmployeeWithUserPayload,
    UpdateEmployeePayload
} from '../types/employee/employeePayload';

export const getAllEmployees = async () =>
    (await api.get<Employee[]>('/api/employee')).data;

export const getEmployeeById = async (id: number) =>
    (await api.get<Employee>(`/api/employee/${id}`)).data;

export const getEmployeeFullById = async (id: number) =>
    (await api.get<EmployeeFull>(`/api/employee/${id}/full`)).data;

export const registerEmployeeWithUser = async (
    payload: RegisterEmployeeWithUserPayload
) => (await api.post<Employee>('/api/employee/register-with-user', payload)).data;

export const updateEmployee = async (
    id: number,
    payload: UpdateEmployeePayload
) => (await api.put<Employee>(`/api/employee/${id}`, payload)).data;

export const deleteEmployee = async (id: number) => {
    await api.delete(`/api/employee/${id}`);
};
