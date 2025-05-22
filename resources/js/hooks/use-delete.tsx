import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useDelete() {
    const [open, setOpen] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState<string>('');

    const confirmDelete = useCallback((url: string) => {
        setDeleteUrl(url);
        setOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteUrl) {
            router.delete(deleteUrl, {
                onFinish: () => setOpen(false),
                onSuccess: () => toast.success('Xóa thành công!'),
            });
        } else {
            toast.error('Không có URL để xóa!');
        }
    }, [deleteUrl]);

    const handleCancel = useCallback(() => setOpen(false), []);

    return {
        open,
        confirmDelete,
        handleDelete,
        handleCancel,
    };
}
