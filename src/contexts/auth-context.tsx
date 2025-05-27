import { authService } from "@/services/auth";
import type { User } from "@/types/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchCurrentUser() {
        try {
            const response = await authService.getCurrentUser();
            setUser(response);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    async function login(username: string, password: string) {
        try {
            await authService.login({ username, password });
            await fetchCurrentUser();
            return true;
        } catch {
            return false;
        }
    }

    function logout() {
        authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}