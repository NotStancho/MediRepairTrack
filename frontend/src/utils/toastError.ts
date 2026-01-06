import toast from 'react-hot-toast';

interface ApiErrorLike {
    message: string;
    errors?: string[];
}

export function showApiError(err: ApiErrorLike) {
    if (err.errors && err.errors.length) {
        err.errors.forEach(e => toast.error(e));
    } else {
        toast.error(err.message);
    }
}
