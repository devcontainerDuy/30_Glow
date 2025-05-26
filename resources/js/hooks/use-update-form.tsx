import { getChangedFields } from '@/lib/getChangedFields';
import axios from 'axios';
import React from 'react';
import { toast } from 'sonner';

type Errors = { [key: string]: string };

export function useUpdateForm<T extends Record<string, unknown>>({ url, oldData, initialData }: { url: string; oldData: T; initialData: T }) {
    const [errors, setErrors] = React.useState<Errors>({});
    const [processing, setProcessing] = React.useState<boolean>(false);

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setProcessing(true);

                const newData = Object.fromEntries(
                    Object.entries(getChangedFields(oldData, initialData)).filter(
                        ([, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
                    ),
                ) as T;
        
                if (Object.keys(newData).length === 0) {
                    toast.info('Không có thay đổi nào để cập nhật.');
                    setProcessing(false);
                    return;
                }

        axios
            .put(url, newData)
            .then((response) => {
                toast.success(response.data.message);
                setErrors({});
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    setErrors(error.response.data.error);
                } else toast.error(error.response.data.message);
            })
            .finally(() => setProcessing(false));
    };

    return { errors, processing, submit };
}
