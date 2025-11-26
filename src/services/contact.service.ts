import apiClient from './api';

export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export const contactService = {
    /**
     * Submit contact message
     */
    sendMessage: async (data: ContactForm): Promise<any> => {
        const response = await apiClient.post('/contact', data);
        return response.data;
    }
};
