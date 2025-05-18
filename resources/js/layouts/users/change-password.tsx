import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generatePassword } from '@/lib/generatesPassword';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ChangePassword: React.FC<{
    data: { password_attributes: string; password: string; password_confirmation: string };
    setData: (field: string, value: string) => void;
    errors: Record<string, string>;
}> = ({ data, setData, errors }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(true);

    const cancel = () => {
        setOpen(false);
        setHidden(true);
        setData('password_attributes', '');
        setData('password', '');
        setData('password_confirmation', '');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Thay đổi mật khẩu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thay đổi mật khẩu</DialogTitle>
                    <DialogDescription>Thay đổi mật khẩu của bạn tại đây. Nhấn lưu khi bạn hoàn tất.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="password_attributes">
                            Mật khẩu cũ <span className="text-red-500">(*)</span>
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
                                id="password_attributes"
                                type={hidden ? 'password' : 'text'}
                                className="block ps-13"
                                required
                                tabIndex={0}
                                autoComplete="current-password"
                                value={data?.password_attributes}
                                onChange={(e) => setData('password_attributes', e.target.value)}
                                placeholder="Nhập mật khẩu cũ"
                            />
                        </div>
                        {errors?.password && <InputError message={errors.password} />}
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="password">
                            Mật khẩu mới <span className="text-red-500">(*)</span>
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
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                        {errors?.password && <InputError message={errors.password} />}
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2">
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
                                placeholder="Xác nhận mật khẩu mới"
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
                                    setData('password', p);
                                    setData('password_confirmation', p);
                                    toast.success('Đã tự động tạo mật khẩu cho người dùng!', {
                                        action: {
                                            label: 'Hoàn tác',
                                            onClick() {
                                                setData('password', '');
                                                setData('password_confirmation', '');
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
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={cancel}>
                        Đóng
                    </Button>
                    <Button type="submit">Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;
