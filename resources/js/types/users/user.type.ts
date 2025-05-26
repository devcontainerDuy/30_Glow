import type { RoleProps } from '@/types';
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

export interface UserBase {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface User extends UserBase {
    id: number;
    uid: string;
    email_verified_at?: string | null;
    avatar?: string;
    status?: string;
    banned_at?: string | null;
    ban_reason?: string | null;
    banned_by?: string | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
    roles?: RoleProps[];
    [key: string]: unknown;
}

export type UserForm = UserBase & {
    password: string;
    password_confirmation: string;
};

export type UserUpdateForm = Partial<Omit<User, 'email_verified_at' | 'banned_at' | 'ban_reason' | 'banned_by' | 'deleted_at'>> & {
    password_attributes?: string;
    password?: string;
    password_confirmation?: string;
};
