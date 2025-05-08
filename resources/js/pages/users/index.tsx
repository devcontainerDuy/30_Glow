import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tài khoản',
        href: '/users',
    },
    {
        title: 'Người dùng',
        href: '/users',
    },
];

const NameCell = ({ name }: { name: string }) => {
    const getInitials = useInitials();

    return (
        <div className="flex items-center gap-2 capitalize">
            <Avatar className="flex h-8 w-8 overflow-hidden rounded-full">
                {/* <AvatarImage src={row.original.avatar} alt={row.original.name} /> */}
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
            <span className="truncate font-semibold">{name}</span>
        </div>
    );
};

const columns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <NameCell name={row.getValue('name')} />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Phone
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('created_at')}</div>,
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(row.original.uid)}>
                        Sao chép UID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => console.log('Edit user', row.original.id)}>
                        Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => console.log('Delete user', row.original.id)}>
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const data: User[] = [
    {
        id: 1,
        uid: 'user-1',
        name: 'Nguyễn Văn A',
        email: 'ken99@example.com',
        avatar: 'https://example.com/avatar1.jpg',
        email_verified_at: '2023-01-01',
        phone: '0123456789',
        address: '123 Main St, Anytown, USA',
        status: 'active',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        deleted_at: null,
    },
    {
        id: 2,
        uid: 'user-2',
        name: 'Trần Thị B',
        email: 'tran.b@example.com',
        avatar: 'https://example.com/avatar2.jpg',
        email_verified_at: '2023-01-02',
        phone: '0987654321',
        address: '456 Elm St, Othertown, USA',
        status: 'inactive',
        created_at: '2023-01-02',
        updated_at: '2023-01-02',
        deleted_at: null,
    },
    {
        id: 3,
        uid: 'user-3',
        name: 'Lê Văn C',
        email: 'le.c@example.com',
        avatar: 'https://example.com/avatar3.jpg',
        email_verified_at: '2023-01-03',
        phone: '0123456789',
        address: '789 Oak St, Sometown, USA',
        status: 'active',
        created_at: '2023-01-03',
        updated_at: '2023-01-03',
        deleted_at: null,
    },
    {
        id: 4,
        uid: 'user-4',
        name: 'Nguyễn Thị D',
        email: 'nguyen.d@example.com',
        avatar: 'https://example.com/avatar4.jpg',
        email_verified_at: '2023-01-04',
        phone: '0123456789',
        address: '101 Pine St, Anycity, USA',
        status: 'inactive',
        created_at: '2023-01-04',
        updated_at: '2023-01-04',
        deleted_at: null,
    },
    {
        id: 5,
        uid: 'user-5',
        name: 'Trần Văn E',
        email: 'tran.e@example.com',
        avatar: 'https://example.com/avatar5.jpg',
        email_verified_at: '2023-01-05',
        phone: '0123456789',
        address: '202 Maple St, Anytown, USA',
        status: 'active',
        created_at: '2023-01-05',
        updated_at: '2023-01-05',
        deleted_at: null,
    },

    {
        id: 6,
        uid: 'user-6',
        name: 'Lê Thị F',
        email: 'le.f@example.com',
        avatar: 'https://example.com/avatar6.jpg',
        email_verified_at: '2023-01-06',
        phone: '0123456789',
        address: '303 Birch St, Othertown, USA',
        status: 'inactive',
        created_at: '2023-01-06',
        updated_at: '2023-01-06',
        deleted_at: null,
    },
    {
        id: 7,
        uid: 'user-7',
        name: 'Nguyễn Văn G',
        email: 'nguyen.g@example.com',
        avatar: 'https://example.com/avatar7.jpg',
        email_verified_at: '2023-01-07',
        phone: '0123456789',
        address: '404 Cedar St, Sometown, USA',
        status: 'active',
        created_at: '2023-01-07',
        updated_at: '2023-01-07',
        deleted_at: null,
    },
    {
        id: 8,
        uid: 'user-8',
        name: 'Trần Thị H',
        email: 'tran.h@example.com',
        avatar: 'https://example.com/avatar8.jpg',
        email_verified_at: '2023-01-08',
        phone: '0123456789',
        address: '505 Spruce St, Anycity, USA',
        status: 'inactive',
        created_at: '2023-01-08',
        updated_at: '2023-01-08',
        deleted_at: null,
    },
    {
        id: 9,
        uid: 'user-9',
        name: 'Lê Văn I',
        email: 'le.i@example.com',
        avatar: 'https://example.com/avatar9.jpg',
        email_verified_at: '2023-01-09',
        phone: '0123456789',
        address: '606 Fir St, Anytown, USA',
        status: 'active',
        created_at: '2023-01-09',
        updated_at: '2023-01-09',
        deleted_at: null,
    },
    {
        id: 10,
        uid: 'user-10',
        name: 'Nguyễn Thị J',
        email: 'nguyen.j@example.com',
        avatar: 'https://example.com/avatar10.jpg',
        email_verified_at: '2023-01-10',
        phone: '0123456789',
        address: '707 Willow St, Othertown, USA',
        status: 'inactive',
        created_at: '2023-01-10',
        updated_at: '2023-01-10',
        deleted_at: null,
    },
    {
        id: 11,
        uid: 'user-11',
        name: 'Trần Văn K',
        email: 'tran.k@example.com',
        avatar: 'https://example.com/avatar11.jpg',
        email_verified_at: '2023-01-11',
        phone: '0123456789',
        address: '808 Ash St, Sometown, USA',
        status: 'active',
        created_at: '2023-01-11',
        updated_at: '2023-01-11',
        deleted_at: null,
    },
];

const Index = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Danh sách người dùng" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Người dùng" description="Quản lý danh sách người dùng" />
                    <div className="flex items-center gap-2">
                        <Link href="/users/trash">
                            <Button variant={'destructive'}>
                                <Trash2 className="h-4 w-4" />
                                <span>Thùng rác</span>
                            </Button>
                        </Link>
                        <Link href="/users/create">
                            <Button>
                                <Plus className="h-4 w-4" />
                                <span>Tạo mới</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <DataTable columns={columns} data={data} searchKey="email" onRowClick={(row) => console.log('Row clicked:', row)} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
