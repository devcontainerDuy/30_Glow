// import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import React, { Suspense } from 'react';

const AuthLayoutTemplate = React.lazy(() => import('@/layouts/auth/auth-simple-layout'));
const ErrorPage = React.lazy(() => import('@/pages/errors/error-page'));

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <Suspense fallback={<ErrorPage status={503} />}>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </Suspense>
    );
}
