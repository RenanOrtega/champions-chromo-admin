import { api } from "@/lib/axios";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";

export class AuthService {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    }

    async logout(): Promise<void> {
        const response = await api.post('/auth/logout');
        return response.data;
    }

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    }

    async checkAuth(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch {
            return false;
        }
    }
}

export const authService = new AuthService();