import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuthorization } from '@/contexts/authorization-context';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User } from 'lucide-react';
import { useCallback } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const permissions = useAuthorization();
    const handlePolicy = useCallback((params: string) => (permissions ?? []).some((permission) => permission === params), [permissions]);

    const mainNavItems: NavItem[] = [
        {
            title: 'Bảng điều khiển',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Tài khoản',
            href: '/#',
            icon: User,
            items: [
                ...(handlePolicy('read-users')
                    ? [
                        {
                            title: 'Người dùng',
                            url: '/users',
                        },
                    ]
                    : []),
                {
                    title: 'Khách hàng',
                    url: '/customers',
                },
                ...(handlePolicy('read-roles')
                    ? [
                        {
                            title: 'Vai trò',
                            url: '/roles',
                        },
                    ]
                    : []),
                ...(handlePolicy('read-permissions')
                    ? [
                        {
                            title: 'Quyền hạn',
                            url: '/permissions',
                        },
                    ]
                    : []),
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
