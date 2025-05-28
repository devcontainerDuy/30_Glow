import { Toaster } from '@/components/ui/sonner';
import { AuthorizationContext } from '@/contexts/authorization-context';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const policy = usePage<SharedData>().props.auth?.permissions;

    return (
        <AuthorizationContext.Provider value={policy}>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <Toaster closeButton position="top-right" duration={2000} richColors visibleToasts={5} containerAriaLabel="Notifications" />
                {children}
            </AppLayoutTemplate>
        </AuthorizationContext.Provider>
    );
};
