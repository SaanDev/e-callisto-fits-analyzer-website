export const categories = ['Getting started', 'Data & analysis', 'Scientific discussion', 'Feature ideas'] as const;
export type Topic = {
    id: string;
    title: string;
    body: string;
    category: string;
    created_at: number;
    updated_at: number;
    author: string;
    reply_count: number;
    owned: boolean;
};
export type Reply = {
    id: string;
    body: string;
    created_at: number;
    author: string;
    owned: boolean;
};
