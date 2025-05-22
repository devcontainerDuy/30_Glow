import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { DialogMaps } from '@/layouts/users/dialog-maps';
import { generatePassword } from '@/lib/generatesPassword';
import type { BreadcrumbItem, UserForm } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
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

const Created: React.FC = () => {
    const [values, setValues] = useState<Required<UserForm>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hidden, setHidden] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios
            .post(route('users.store'), values)
            .then((response) => {
                toast.success(response.data.message);
                reset();
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    setErrors(error.response.data.error);
                } else toast.error(error.response.data.message);
            })
            .finally(() => setProcessing(false));
    };

    const reset = () => {
        setValues({
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            password_confirmation: '',
        });
        setHidden(true);
        setProcessing(false);
        setErrors({});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tạo mới" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Tạo mới" description="Tạo người dùng mới" />

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
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">(*)</span>
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    required
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
                                        value={values?.password}
                                        onChange={(e) => setValues({ ...values, password: e.target.value })}
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
                                        value={values?.password_confirmation}
                                        onChange={(e) => setValues({ ...values, password_confirmation: e.target.value })}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                </div>
                                {errors?.password_confirmation && <InputError message={errors.password_confirmation} />}

                                <div className="text-end">
                                    <Button
                                        variant={'link'}
                                        type="button"
                                        className="text-muted-foreground p-0 text-end text-sm"
                                        tabIndex={0}
                                        onClick={() => {
                                            const p = generatePassword(8);
                                            setValues({ ...values, password: p, password_confirmation: p });
                                            toast.success('Đã tự động tạo mật khẩu cho người dùng!', {
                                                action: {
                                                    label: 'Hoàn tác',
                                                    onClick() {
                                                        setValues({ ...values, password: '', password_confirmation: '' });
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
