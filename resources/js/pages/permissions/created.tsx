import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, HeadProps, PermissionForm } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useState, type FC, type FormEventHandler } from 'react';
import { toast } from 'sonner';

const Created: FC<{ title: string; head: HeadProps }> = ({ title, head }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tài khoản',
            href: route('users.index'),
        },
        {
            title: 'Vai trò',
            href: route('permissions.index'),
        },
        {
            title: 'Tạo mới',
            href: route('permissions.create'),
        },
    ];

    const [values, setValues] = useState<Required<PermissionForm>>({
        name: '',
        guard_name: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState<boolean>(false);

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setProcessing(true);

        axios
            .post(route('permissions.store'), values)
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
            guard_name: '',
        });
        setErrors({});
        setProcessing(false);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title={head.title} description={head?.description} />

                    <Link href={route('permissions.index')} className="flex items-center gap-2">
                        <Button variant={'link'}>
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại trang trước</span>
                        </Button>
                    </Link>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border md:w-3/4 lg:w-1/2">
                        <div className="border-b-border/70 dark:border-b-border/70 flex flex-col items-center justify-between border-b p-4 lg:flex-row">
                            <h3 className="text-lg font-semibold">Thông tin quyền hạn</h3>
                            <p className="text-muted-foreground text-sm">Nhập thông tin quyền hạn</p>
                        </div>

                        <form onSubmit={submit} className="grid w-full grid-cols-1 gap-6 p-8">
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Tên quyền hạn <span className="text-red-500">(*)</span>
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder="Nhập tên quyền hạn"
                                    required
                                    value={values?.name}
                                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                                />
                                {errors?.name && <InputError message={errors.name} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="guard_name">
                                    Guard Name <span className="text-red-500">(*)</span>
                                </Label>
                                <Select value={values?.guard_name} onValueChange={(value) => setValues({ ...values, guard_name: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a guard" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Guard Name</SelectLabel>
                                            <SelectItem value="web">Web</SelectItem>
                                            <SelectItem value="api">API</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors?.guard_name && <InputError message={errors.guard_name} />}
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
