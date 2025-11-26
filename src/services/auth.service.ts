import apiClient from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: 'contributor' | 'validator';
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'contributor' | 'validator';
    is_active: boolean;
    created_at: string;
    // Gamification fields - may not be returned by backend initially
    points?: number;
    coins?: number;
    badges?: any[];
    level?: number;
    nextLevel?: number;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<User> {
        const response = await apiClient.post<User>('/api/auth/register', data);
        return response.data;
    }

    /**
     * Login user and get JWT token
     */
    async login(credentials: LoginCredentials): Promise<TokenResponse> {
        const response = await apiClient.post<TokenResponse>('/api/auth/login', credentials);
        const { access_token } = response.data;

        // Store token in localStorage
        this.setToken(access_token);

        return response.data;
    }

    /**
     * Get current user information
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/api/auth/me');
        return response.data;
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/api/auth/logout');
        } finally {
            this.clearToken();
        }
    }

    /**
     * Store JWT token in localStorage
     */
    setToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    /**
     * Get JWT token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /**
     * Clear JWT token from localStorage
     */
    clearToken(): void {
        localStorage.removeItem('access_token');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}

export default new AuthService();
