export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export type PermissionProps = Partial<Omit<Permission, 'guard_name' | 'created_at' | 'updated_at'>>;

export type PermissionForm = Partial<Omit<Permission, 'id' | 'created_at' | 'updated_at'>>;
