import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';

type UserForm = {
    username: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
};

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
        title: 'Tạo mới',
        href: '/users/create',
    },
];

const Created = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<UserForm>>({
        username: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });
    const [hidden, setHidden] = useState<boolean>(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);

        post(route('users.store'), {
            onFinish: () => reset('username', 'email', 'phone', 'address', 'password', 'password_confirmation'),
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tạo mới" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Tạo mới" description="Tạo người dùng mới" />
                    <div className="flex items-center gap-2">
                        <Button variant={'link'} onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại trang trước</span>
                        </Button>
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border w-1/2 overflow-hidden rounded-xl border">
                        <div className="border-b-border/70 dark:border-b-border/70 flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Thông tin người dùng</h3>
                            <p className="text-muted-foreground text-sm">Nhập thông tin người dùng</p>
                        </div>
                        <form onSubmit={submit} className="grid w-full grid-cols-1 gap-6 p-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">
                                    Họ và Tên <span className="text-red-500">(*)</span>
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="Nhập họ và tên"
                                    required
                                    value={data?.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                                {errors?.username && <InputError message={errors.username} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">(*)</span>
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    required
                                    value={data?.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors?.email && <InputError message={errors.email} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={data?.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors?.phone && <InputError message={errors.phone} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    placeholder="Nhập địa chỉ"
                                    value={data?.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors?.address && <InputError message={errors.address} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Mật khẩu <span className="text-red-500">(*)</span>
                                </Label>

                                <div className="relative flex">
                                    <Button
                                        type="button"
                                        variant={'outline'}
                                        className="absolute inset-y-0 start-0 rounded-e-none"
                                        tabIndex={0}
                                        onClick={() => setHidden(!hidden)}
                                    >
                                        {!hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Input
                                        id="password"
                                        type={hidden ? 'password' : 'text'}
                                        className="block ps-13"
                                        required
                                        tabIndex={0}
                                        autoComplete="current-password"
                                        value={data?.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </div>
                                {errors?.password && <InputError message={errors.password} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Xác nhận mật khẩu <span className="text-red-500">(*)</span>
                                </Label>

                                <div className="relative flex">
                                    <Button
                                        type="button"
                                        variant={'outline'}
                                        className="absolute inset-y-0 start-0 rounded-e-none"
                                        tabIndex={0}
                                        onClick={() => setHidden(!hidden)}
                                    >
                                        {!hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Input
                                        id="password_confirmation"
                                        type={hidden ? 'password' : 'text'}
                                        className="block ps-13"
                                        required
                                        tabIndex={0}
                                        autoComplete="current-password"
                                        value={data?.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                </div>
                                {errors?.password_confirmation && <InputError message={errors.password_confirmation} />}

                                <div className="text-end">
                                    <Button
                                        variant={'link'}
                                        className="text-muted-foreground p-0 text-end text-sm"
                                        tabIndex={0}
                                        onClick={() => {
                                            /* Add your logic here */
                                        }}
                                    >
                                        Tự tạo mật khẩu!
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" tabIndex={0} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Tạo mới
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Created;
