import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    uid: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: string | null;
    phone? : string | null;
    address? : string | null;
    status: string;
    banned_at?: string | null;
    ban_reason?: string | null;
    banned_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;
    [key: string]: unknown; // This allows for additional properties...
}


export type UserForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
};
