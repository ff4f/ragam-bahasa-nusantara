import apiClient from './api';
import { User } from './auth.service';

class UserService {
    /**
     * Update user profile
     */
    async updateProfile(data: { name?: string; email?: string }): Promise<User> {
        const response = await apiClient.put<User>('/api/users/profile', data);
        return response.data;
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/api/users/me');
        return response.data;
    }
}

export default new UserService();
