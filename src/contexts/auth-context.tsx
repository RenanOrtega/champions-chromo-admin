import { authService } from "@/services/auth";
import type { AuthContextType, User } from "@/types/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await authService.login({ username, password });
            setUser(response.user);
            return { success: true, message: response.message };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao fazer login';
            return { success: false, message };
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const response = await authService.register({ username, password });
            setUser(response.user);
            return { success: true, message: response.message };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao registrar usuário';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};