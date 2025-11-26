import apiClient from './api';

export interface DictionaryEntry {
    id: number;
    source_text: string;
    target_text: string;
    source_lang: string;
    target_lang: string;
    example_source?: string;
    example_target?: string;
    category?: string;
    dialect?: string;
    region?: string;
    like_count?: number;
    comment_count?: number;
    is_liked?: boolean;
    audio_url?: string;
}

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    dictionary_id: number;
    created_at: string;
    user_name: string;
    parent_id?: number;
}

export interface TranslateResponse {
    original_text: string;
    translated_text: string;
    source_lang: string;
    target_lang: string;
    matches: DictionaryEntry[];
}

export const dictionaryService = {
    translate: async (text: string, sourceLang: string, targetLang: string): Promise<TranslateResponse> => {
        const response = await apiClient.post<TranslateResponse>('/api/dictionary/translate', {
            text,
            source_lang: sourceLang,
            target_lang: targetLang
        });
        return response.data;
    },

    seed: async () => {
        const response = await apiClient.post('/api/dictionary/seed');
        return response.data;
    },

    search: async (query: string = "", targetLang: string = "", page: number = 1, limit: number = 50) => {
        const response = await apiClient.get('/api/dictionary/search', {
            params: {
                q: query,
                target_lang: targetLang,
                page,
                limit
            }
        });
        return response.data;
    },

    getComments: async (dictionaryId: number) => {
        const response = await apiClient.get<Comment[]>(`/api/interactions/dictionary/${dictionaryId}/comments`);
        return response.data;
    },

    addComment: async (dictionaryId: number, content: string, parentId?: number) => {
        const response = await apiClient.post<Comment>(`/api/interactions/dictionary/${dictionaryId}/comments`, {
            content,
            parent_id: parentId
        });
        return response.data;
    },

    toggleLike: async (dictionaryId: number) => {
        const response = await apiClient.post<{ liked: boolean, total_likes: number }>(`/api/interactions/dictionary/${dictionaryId}/like`);
        return response.data;
    }
};
