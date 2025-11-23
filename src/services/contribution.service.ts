import apiClient from './api';

export interface ContributionCreate {
    contribution_type?: string;
    province?: string;
    region?: string;
    language?: string;
    dialect?: string;
    ethnic?: string;
    source_text?: string;
    target_text?: string;
    example_source?: string;
    example_target?: string;
    audio_url?: string;
    notes?: string;
}

export interface Contribution extends ContributionCreate {
    id: number;
    user_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    reviewed_at?: string;
    reviewed_by?: number;
}

export const contributionService = {
    create: async (data: ContributionCreate): Promise<Contribution> => {
        const response = await apiClient.post<Contribution>('/api/contributions/', data);
        return response.data;
    },

    getMyContributions: async (page: number = 1, limit: number = 50) => {
        const response = await apiClient.get('/api/contributions/', {
            params: { page, limit }
        });
        return response.data;
    },

    getAllContributions: async (page: number = 1, limit: number = 50, status?: string) => {
        const response = await apiClient.get('/api/contributions/all', {
            params: { page, limit, status_filter: status }
        });
        return response.data;
    },

    updateStatus: async (id: number, status: 'approved' | 'rejected', notes?: string) => {
        const response = await apiClient.patch(`/api/contributions/${id}`, {
            status,
            notes
        });
        return response.data;
    }
};
