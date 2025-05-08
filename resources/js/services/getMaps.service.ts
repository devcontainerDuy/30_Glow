import type { Districts, Provinces, Wards } from '@/types';

export async function getProvinces(): Promise<Provinces> {
    return new Promise((resolve, reject) => {
        fetch('/api/provinces')
            .then((response) => response.json())
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
export async function getDistricts(id: number): Promise<Districts> {
    return new Promise((resolve, reject) => {
        fetch(`/api/districts/${id}`)
            .then((response) => response.json())
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export async function getWards(id: number): Promise<Wards> {
    return new Promise((resolve, reject) => {
        fetch(`/api/wards/${id}`)
            .then((response) => response.json())
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
