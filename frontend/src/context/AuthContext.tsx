import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import { login } from '../api/auth';
import { saveAuth, getAuth, clearAuth } from '../utils/storage';

interface AuthContextType {
    user: AuthUser | null;
    signIn: (email: string, password: string) => Promise<AuthUser>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getAuth());

    const signIn = async (email: string, password: string): Promise<AuthUser> => {
        const data = await login(email, password);
        saveAuth(data);
        setUser(data);
        return data;
    };

    const signOut = () => {
        clearAuth();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
}
