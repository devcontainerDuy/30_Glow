import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tài khoản',
        href: '/users',
    },
    {
        title: 'Vai trò',
        href: '/roles',
    },
    {
        title: 'Tạo mới',
        href: '/roles/create',
    },
];

const Created: FC<{ title: string; head: { title: string; description?: string } }> = ({ title, head }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title={head.title} description={head?.description} />

                    <Link href={route('roles.index')} className="flex items-center gap-2">
                        <Button variant={'link'}>
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại trang trước</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};

export default Created;
