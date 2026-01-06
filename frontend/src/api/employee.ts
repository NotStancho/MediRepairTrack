import { api } from './api';
import type { Employee } from '../types/employee';

export const getEmployeeById = async (id: number) =>
    (await api.get<Employee>(`/api/employee/${id}`)).data;