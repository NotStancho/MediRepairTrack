import { api } from './api';
import type {AuthUser} from '../types/auth';

export async function login(email: string, password: string): Promise<AuthUser> {
    const res = await api.post<AuthUser>('/api/auth/login', {
        email,
        password,
    });
    return res.data;
}