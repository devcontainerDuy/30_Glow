import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import ChangePassword from '@/layouts/users/change-password';
import { DialogMaps } from '@/layouts/users/dialog-maps';
import { getChangedFields } from '@/lib/getChangedFields';
import type { BreadcrumbItem, User, UserUpdateForm } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tài khoản',
        href: '/users',
    },
    {
        title: 'Người dùng',
        href: '/users',
    },
    {
        title: 'Chỉnh sửa',
        href: '/users/{id}/edit',
    },
];

const Edited: React.FC<{ user: User }> = ({ user }) => {
    const { errors } = usePage().props;
    const [values, setValues] = useState<Required<UserUpdateForm>>({
        id: Number(user.id),
        uid: user.uid || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        password_attributes: '',
        password: '',
        password_confirmation: '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
        role: Array.isArray(user.role) ? user.role : [],
        status: user.status || '',
        avatar: user.avatar || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const changedFields = Object.fromEntries(
            Object.entries(getChangedFields(user, values)).filter(
                ([, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
            ),
        ) as UserUpdateForm;
        
        if (Object.keys(changedFields).length === 0) {
            toast.info('Không có thay đổi nào để cập nhật.');
            return;
        }

        router.put(route('users.update', user.id), changedFields, {
            onSuccess: () => toast.success('Cập nhật người dùng thành công!'),
            onError: () => toast.error('Cập nhật thất bại!'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chỉnh sửa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Chỉnh sửa" description="Chỉnh sửa thông tin người dùng" />

                    <Link href={route('users.index')} className="flex items-center gap-2">
                        <Button variant={'link'}>
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại trang trước</span>
                        </Button>
                    </Link>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border md:w-3/4 lg:w-1/2">
                        <div className="border-b-border/70 dark:border-b-border/70 flex flex-col items-center justify-between border-b p-4 lg:flex-row">
                            <h3 className="text-lg font-semibold">Thông tin người dùng</h3>
                            <p className="text-muted-foreground text-sm">Thông tin của người dùng</p>
                        </div>
                        <form onSubmit={submit} className="grid w-full grid-cols-1 gap-6 p-8">
                            <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-3">
                                <div className="grid w-full gap-2 lg:w-1/2">
                                    <Label htmlFor="name">Họ và Tên</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nhập họ và tên"
                                        value={values?.name}
                                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                                    />
                                    {errors?.name && <InputError message={errors.name} />}
                                </div>
                                <div className="grid w-full gap-2 lg:w-1/2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={values?.phone}
                                        onChange={(e) => setValues({ ...values, phone: e.target.value })}
                                    />
                                    {errors?.phone && <InputError message={errors.phone} />}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    value={values?.email}
                                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                                />
                                {errors?.email && <InputError message={errors.email} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <DialogMaps data={values} setData={setValues} />

                                {errors?.address && <InputError message={errors.address} />}
                            </div>

                            <ChangePassword
                                data={values}
                                setData={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
                                errors={errors}
                            />

                            <Button type="submit" className="w-full" tabIndex={0}>
                                Lưu thay đổi
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Edited;
