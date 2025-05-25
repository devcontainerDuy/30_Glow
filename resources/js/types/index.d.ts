import type { LucideIcon } from 'lucide-react';
export * from './users';
export * from './roles';
export * from './maps';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
}

export interface HeadProps {
    title: string;
    description?: string;
}
