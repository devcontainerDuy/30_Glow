import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User } from 'lucide-react';
import AppLogo from './app-logo';
import { useCallback } from 'react';
import { useAuthorization } from '@/contexts/authorization-context';

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

    const handlePolicy = useCallback((params: string) => {
        return permissions.filter((p) => p.name === params);
    }, [permissions])

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
                ...(handlePolicy('real-users') ? [{
                    title: 'Người dùng',
                    url: '/users',
                }] : []),
                {
                    title: 'Vai trò',
                    url: '/roles',
                },
                {
                    title: 'Quyền hạn',
                    url: '/permissions',
                },
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
