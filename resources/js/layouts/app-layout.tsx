import { Toaster } from '@/components/ui/sonner';
import { AuthorizationContext } from '@/contexts/authorization-context';
import React, { type ReactNode } from 'react';
// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import Spinner from '@/components/common/spinner';
import type { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const AppLayoutTemplate = React.lazy(() => import('@/layouts/app/app-sidebar-layout'));

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const permissions = usePage<SharedData>().props.auth?.permissions;

    return (
        <React.Suspense fallback={<Spinner />}>
            <AuthorizationContext.Provider value={permissions}>
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    <Toaster closeButton position="top-right" duration={2000} richColors visibleToasts={5} containerAriaLabel="Notifications" />
                    {children}
                </AppLayoutTemplate>
            </AuthorizationContext.Provider>
        </React.Suspense>
    );
};
