import AlertDialogDelete from '@/components/alert-dialog-delete';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import type { BreadcrumbItem, HeadProps, Role } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

const Index: React.FC<{ title: string; head: HeadProps; data: Role[] }> = ({ title, head, data }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tài khoản',
            href: route('users.index'),
        },
        {
            title: 'Vai trò',
            href: route('roles.index'),
        },
    ];
    
    const { open, confirmDelete, handleDelete, handleCancel } = useDelete();
    const columns = useMemo<ColumnDef<Role>[]>(
        () => [
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
                            <span className="text-sm font-medium">Tên vai trò</span>
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => row.getValue('name'),
            },
            {
                accessorKey: 'guard_name',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            <span className="text-sm font-medium">Guard Name</span>
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => <span className="text-sm font-medium">{row.getValue('guard_name')}</span>,
            },
            {
                accessorKey: 'permissions',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            <span className="text-sm font-medium">Quyền hạn</span>
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const permissions = row.getValue('permissions') as { name: string }[];
                    return <span className="text-sm font-medium">{permissions.map((permission) => permission.name).join(', ') || 'N/A'}</span>;
                },
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
                cell: ({ row }) => <div>{formatDate(row.getValue('created_at'))}</div>,
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
                            <Link href={route('roles.edit', row.original.id)}>
                                <DropdownMenuItem className="cursor-pointer">Sửa</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => confirmDelete(route('roles.destroy', row.original.id))}>
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [confirmDelete],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <AlertDialogDelete open={open} cancel={handleCancel} handle={handleDelete} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title={head.title} description={head?.description} />

                    <div className="flex items-center gap-2">
                        <Link href="/roles/trash">
                            <Button variant={'destructive'}>
                                <Trash2 className="h-4 w-4" />
                                <span>Thùng rác</span>
                            </Button>
                        </Link>
                        <Link href={route('roles.create')}>
                            <Button>
                                <Plus className="h-4 w-4" />
                                <span>Tạo mới</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    <DataTable columns={columns} data={data} searchKey="name" />
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
