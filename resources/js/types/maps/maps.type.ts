export type Provinces = {
    status: boolean;
    data: Province[];
}

export interface Province {
    id: number;
    name: string;
    gso_id?: string;
    created_at?: string;
    updated_at?: string;
}

export type Districts = {
    status: boolean;
    data: District[];
}

export interface District {
    id: number;
    name: string;
    gso_id: string;
    province_id: number;
    created_at: string;
    updated_at: string;
}

export type Wards = {
    status: boolean;
    data: Ward[];
}

export interface Ward {
    id: number;
    name: string;
    gso_id: string;
    district_id: number;
    created_at: string;
    updated_at: string;
}