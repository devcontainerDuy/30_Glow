import { Breadcrumbs } from '@/components/breadcrumbs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import ActionButtons from '@/layouts/file/action-buttons';
import TableList from '@/layouts/file/table-list';
import { BreadcrumbItem } from '@/types';
import { FileItem, orderBy, sortBy, viewMode } from '@/types/flie';
import { Head } from '@inertiajs/react';
import { ChevronRight, File, Folder } from 'lucide-react';
import * as React from 'react';

// This is sample data.
const data = {
    tree: [
        ['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
        ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
        ['lib', ['util.ts']],
        ['public', 'favicon.ico', 'vercel.svg'],
        '.eslintrc.json',
        '.gitignore',
        'next.config.js',
        'tailwind.config.js',
        'package.json',
        'README.md',
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarGroup className="gap-2">
                    <h1 className="text-primary text-xl font-bold tracking-tight">File Explorer</h1>
                    <span className="text-muted-foreground text-xs">Browse and manage your project files</span>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.tree.map((item, index) => (
                                <Tree key={index} item={item as string[]} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}

const Tree = React.memo(({ item }: { item: string | string[] }) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];

    if (!items.length) {
        return (
            <SidebarMenuButton isActive={name ? true : false} className={`data-[active=${name ? true : false}]:bg-transparent`}>
                <File />
                {name}
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={name === 'components' || name === 'ui'}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        {name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
});

export default function Page() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Files',
            href: '/files',
        },
        {
            title: 'File Explorer',
            href: '/files/explorer',
        },
    ];

    const [values, setValues] = React.useState<FileItem[]>([
        {
            id: '1',
            name: 'product-image-1.jpg',
            type: 'image/jpeg',
            size: '1.2 MB',
            modified: '2025-06-08',
            path: 'storage/public/images/products',
            url: 'https://readdy.ai/api/search-image?query=Professional%20product%20photography%20of%20a%20sleek%20modern%20smartphone%20with%20minimalist%20background%2C%20high%20resolution%20commercial%20product%20shot%20with%20soft%20lighting%20and%20subtle%20shadows%2C%20clean%20composition%2C%20studio%20lighting%2C%20white%20background%2C%20marketing%20material&width=800&height=600&seq=1&orientation=landscape',
        },
        {
            id: '2',
            name: 'user-avatar.png',
            type: 'image/png',
            size: '450 KB',
            modified: '2025-06-07',
            path: 'storage/public/images/users',
            url: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20business%20person%20with%20neutral%20expression%2C%20clean%20studio%20lighting%2C%20minimalist%20background%2C%20high%20quality%20professional%20photography%2C%20corporate%20profile%20picture%20style%2C%20soft%20shadows%2C%20sharp%20details&width=600&height=600&seq=2&orientation=squarish',
        },
        {
            id: '3',
            name: 'banner-homepage.jpg',
            type: 'image/jpeg',
            size: '2.4 MB',
            modified: '2025-06-05',
            path: 'storage/public/images/banners',
            url: 'https://readdy.ai/api/search-image?query=Wide%20format%20website%20banner%20with%20abstract%20gradient%20background%2C%20modern%20digital%20design%20with%20soft%20flowing%20colors%2C%20minimalist%20web%20header%20image%2C%20professional%20marketing%20material%20with%20space%20for%20text%2C%20clean%20composition&width=1000&height=400&seq=3&orientation=landscape',
        },
        {
            id: '4',
            name: 'report-q2.pdf',
            type: 'application/pdf',
            size: '3.7 MB',
            modified: '2025-06-03',
            path: 'storage/public/documents',
            url: '',
        },
        {
            id: '5',
            name: 'product-demo.mp4',
            type: 'video/mp4',
            size: '24.5 MB',
            modified: '2025-06-01',
            path: 'storage/public/videos',
            url: '',
        },
        {
            id: '6',
            name: 'product-image-2.jpg',
            type: 'image/jpeg',
            size: '1.5 MB',
            modified: '2025-06-08',
            path: 'storage/public/images/products',
            url: 'https://readdy.ai/api/search-image?query=Professional%20product%20photography%20of%20wireless%20earbuds%20on%20minimalist%20background%2C%20high%20resolution%20commercial%20product%20shot%20with%20soft%20lighting%20and%20subtle%20shadows%2C%20clean%20composition%2C%20studio%20lighting%2C%20white%20background%2C%20marketing%20material&width=800&height=600&seq=4&orientation=landscape',
        },
        {
            id: '7',
            name: 'product-image-3.jpg',
            type: 'image/jpeg',
            size: '1.8 MB',
            modified: '2025-06-07',
            path: 'storage/public/images/products',
            url: 'https://readdy.ai/api/search-image?query=Professional%20product%20photography%20of%20a%20modern%20smartwatch%20with%20minimalist%20background%2C%20high%20resolution%20commercial%20product%20shot%20with%20soft%20lighting%20and%20subtle%20shadows%2C%20clean%20composition%2C%20studio%20lighting%2C%20white%20background%2C%20marketing%20material&width=800&height=600&seq=5&orientation=landscape',
        },
        {
            id: '8',
            name: 'banner-sale.jpg',
            type: 'image/jpeg',
            size: '2.1 MB',
            modified: '2025-06-04',
            path: 'storage/public/images/banners',
            url: 'https://readdy.ai/api/search-image?query=Wide%20format%20promotional%20banner%20with%20vibrant%20colors%20announcing%20a%20special%20sale%2C%20modern%20digital%20design%20with%20eye-catching%20elements%2C%20professional%20marketing%20material%20with%20space%20for%20text%2C%20clean%20composition%2C%20e-commerce%20promotional%20graphic&width=1000&height=400&seq=6&orientation=landscape',
        },
    ]);
    const [viewMode, setViewMode] = React.useState<viewMode>('list');
    const [isActionButtons, setIsActionButtons] = React.useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
    const [sortBy, setSortBy] = React.useState<sortBy>('name');
    const [orderBy, setOrderBy] = React.useState<orderBy>('asc');

    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const sortedValues = React.useMemo(() => {
        return values.sort((a, b) => {
            if (sortBy === 'name') {
                return orderBy === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (sortBy === 'size') {
                return orderBy === 'asc' ? parseFloat(a.size) - parseFloat(b.size) : parseFloat(b.size) - parseFloat(a.size);
            } else if (sortBy === 'modified') {
                return orderBy === 'asc' ? new Date(a.modified).getTime() - new Date(b.modified).getTime() : new Date(b.modified).getTime() - new Date(a.modified).getTime();
            }
            return orderBy === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
    }, [values, sortBy, orderBy]);

    React.useEffect(() => {
        setIsActionButtons(Boolean(selectedFiles.length > 0));
    }, [selectedFiles]);
    
    return (
        <SidebarProvider>
            <Head title={'File Explorer'} />
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </header>
                <div className="relative flex flex-1 flex-col gap-4 overflow-hidden p-4">
                    <div className="bg-muted/50 rounded-xl">
                        <ActionButtons
                            action={isActionButtons}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            sort={sortBy}
                            setSort={setSortBy}
                            orderBy={orderBy}
                            setOrderBy={setOrderBy}
                            query={searchQuery}
                            setQuery={setSearchQuery}
                        />
                    </div>
                    <div className="bg-muted/50 relative flex-1 overflow-hidden rounded-xl">
                        <ScrollArea className="h-[80svh] w-full p-4">
                            <TableList
                                selected={selectedFiles}
                                setSelected={setSelectedFiles}
                                query={searchQuery}
                                viewMode={viewMode}
                                dataTable={sortedValues}
                            />
                        </ScrollArea>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

