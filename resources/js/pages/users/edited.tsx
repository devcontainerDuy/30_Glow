import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateForm } from '@/hooks/use-update-form';
import AppLayout from '@/layouts/app-layout';
import ChangePassword from '@/layouts/users/change-password';
import { DialogMaps } from '@/layouts/users/dialog-maps';
import type { BreadcrumbItem, HeadProps, RoleProps, User, UserUpdateForm } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const Edited: React.FC<{ title: string; head: HeadProps; user: User; role: RoleProps[] }> = ({ title, head, user, role }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tài khoản',
            href: route('users.index'),
        },
        {
            title: 'Người dùng',
            href: route('users.index'),
        },
        {
            title: head.title,
            href: route('users.edit', user.id),
        },
    ];
    const [values, setValues] = useState<Required<UserUpdateForm>>({
        id: Number(user.id),
        uid: user.uid || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || null,
        password_attributes: '',
        password: '',
        password_confirmation: '',
        created_at: new Date(user.created_at || ''),
        updated_at: new Date(user.updated_at || ''),
        roles: user.roles?.map((role) => role.name),
        status: user.status || '',
    });
    const { errors, processing, submit } = useUpdateForm<UserUpdateForm>({
        url: route('users.update', user.id),
        oldData: user,
        initialData: values,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title={head.title} description={head?.description} />

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
                                        value={values?.name as string}
                                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                                    />
                                    {errors?.name && <InputError message={errors.name} />}
                                </div>
                                <div className="grid w-full gap-2 lg:w-1/2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={values?.phone as string}
                                        onChange={(e) => setValues({ ...values, phone: e.target.value })}
                                    />
                                    {errors?.phone && <InputError message={errors.phone} />}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-3">
                                    <div className="grid w-full gap-2 lg:w-1/2">
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">(*)</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            placeholder="Nhập email"
                                            required
                                            value={values?.email as string}
                                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                                        />
                                        {errors?.email && <InputError message={errors.email} />}
                                    </div>

                                    <div className="grid w-full gap-2 lg:w-1/2">
                                        <Label htmlFor="role">Vai trò</Label>
                                        <Select
                                            onValueChange={(e) => setValues({ ...values, roles: [e] })}
                                            defaultValue={(values?.roles as string[])[0]}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {role?.map((role: RoleProps) => (
                                                    <SelectItem key={role.id} value={role.name as string}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors?.role && <InputError message={errors.role} />}
                                    </div>
                                </div>
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

                            <Button type="submit" className="w-full" tabIndex={0} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
