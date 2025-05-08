import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { DialogMaps } from '@/layouts/users/dialog-maps';
import { generatePassword } from '@/lib/generatesPassword';
import type { BreadcrumbItem, UserForm} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';
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
        title: 'Tạo mới',
        href: '/users/create',
    },
];

const Created = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<UserForm>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmed: '',
    });
    const [hidden, setHidden] = useState<boolean>(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);

        post(route('users.store'), {
            onFinish: () => reset('name', 'email', 'phone', 'address', 'password', 'confirmed'),
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
                    <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border md:w-3/4 lg:w-1/2">
                        <div className="border-b-border/70 dark:border-b-border/70 flex flex-col items-center justify-between border-b p-4 lg:flex-row">
                            <h3 className="text-lg font-semibold">Thông tin người dùng</h3>
                            <p className="text-muted-foreground text-sm">Nhập thông tin người dùng</p>
                        </div>
                        <form onSubmit={submit} className="grid w-full grid-cols-1 gap-6 p-8">
                            <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-3">
                                <div className="grid w-full gap-2 lg:w-1/2">
                                    <Label htmlFor="name">
                                        Họ và Tên <span className="text-red-500">(*)</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Nhập họ và tên"
                                        required
                                        value={data?.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors?.name && <InputError message={errors.name} />}
                                </div>
                                <div className="grid w-full gap-2 lg:w-1/2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={data?.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors?.phone && <InputError message={errors.phone} />}
                                </div>
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
                                <Label htmlFor="address">Địa chỉ</Label>
                                <DialogMaps data={data} setData={setData} />

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
                                <Label htmlFor="confirmed">
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
                                        id="confirmed"
                                        type={hidden ? 'password' : 'text'}
                                        className="block ps-13"
                                        required
                                        tabIndex={0}
                                        autoComplete="current-password"
                                        value={data?.confirmed}
                                        onChange={(e) => setData('confirmed', e.target.value)}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                </div>
                                {errors?.confirmed && <InputError message={errors.confirmed} />}

                                <div className="text-end">
                                    <Button
                                        variant={'link'}
                                        type="button"
                                        className="text-muted-foreground p-0 text-end text-sm"
                                        tabIndex={0}
                                        onClick={() => {
                                            const p = generatePassword(8);
                                            setData('password', p);
                                            setData('confirmed', p);
                                            toast.success('Đã tự động tạo mật khẩu cho người dùng!', {
                                                action: {
                                                    label: 'Hoàn tác',
                                                    onClick() {
                                                        setData('password', '');
                                                        setData('confirmed', '');
                                                        toast.error('Đã hoàn tác tạo mật khẩu!', {
                                                            action: {
                                                                label: 'Ẩn',
                                                                onClick() {},
                                                            },
                                                        });
                                                    },
                                                },
                                            });
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
