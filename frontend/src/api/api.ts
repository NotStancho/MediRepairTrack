import axios, {type AxiosError} from 'axios';
import {showApiError} from "../utils/toastError.ts";

export interface ApiError {
    status: number;
    message: string;
    errors?: string[];
    timestamp?: string;
}

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiError>) => {
        const data = error.response?.data;

        const apiError = {
            status: data?.status ?? error.response?.status ?? 500,
            message: data?.message ?? 'Сталася помилка',
            errors: data?.errors,
        };

        showApiError(apiError);

        return Promise.reject(apiError);
    }
);