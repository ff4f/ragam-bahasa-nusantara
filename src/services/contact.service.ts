import apiClient from './api';

export interface ContactData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    id: number;
    user_id: number | null;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

class ContactService {
    /**
     * Submit contact message
     */
    async submitContact(data: ContactData): Promise<ContactResponse> {
        const response = await apiClient.post<ContactResponse>('/api/contact/', data);
        return response.data;
    }

    /**
     * Get my contact messages
     */
    async getMyMessages(): Promise<ContactResponse[]> {
        const response = await apiClient.get<ContactResponse[]>('/api/contact/my-messages');
        return response.data;
    }
}

export default new ContactService();
