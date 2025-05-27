import { z } from "zod";

export interface User {
    id: string;
    username: string;
    roles: string[];
    lastLoginAt?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, password: string, email: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Nome de usuário é obrigatório")
        .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;