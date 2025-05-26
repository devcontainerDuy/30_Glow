import type { Config } from 'ziggy-js';
import type { RoleProps } from '@/types';

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
    avatar?: string;
    status?: string;
}

export interface User extends UserBase {
    id: number;
    uid: string;
    email_verified_at?: string | null;
    banned_at?: string | null;
    ban_reason?: string | null;
    banned_by?: string | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
    roles?: RoleProps[] | undefined;
    [key: string]: unknown;
}

export interface UserForm extends UserBase {
    password: string;
    password_confirmation: string;
}

export interface UserUpdateForm extends UserBase {
    id: number;
    uid: string;
    password_attributes?: string;
    password?: string;
    password_confirmation?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    roles?: RoleProps[] | string[];
    status?: string;
    avatar?: string;
    [key: string]: unknown;
}
