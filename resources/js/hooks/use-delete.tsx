import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function useDelete() {
    const [open, setOpen] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState<string>('');

    const confirmDelete = (url: string) => {
        setDeleteUrl(url);
        setOpen(true);
    };

    const handleDelete = () => {
        if (deleteUrl) {
            router.delete(deleteUrl, {
                onFinish: () => setOpen(false),
                onSuccess: () => toast.success('Xóa thành công!'),
            });
        } else {
            toast.error('Không có URL để xóa!');
        }
    };

    const handleCancel = () => setOpen(false);

    return {
        open,
        confirmDelete,
        handleDelete,
        handleCancel,
    };
}
