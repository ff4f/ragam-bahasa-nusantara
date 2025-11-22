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
    }
};
