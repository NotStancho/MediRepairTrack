export const saveAuth = (user: any) => {
    localStorage.setItem('auth', JSON.stringify(user));
};

export const getAuth = () => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
    localStorage.removeItem('auth');
};