import type { PermissionProps } from "@/types";

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: PermissionProps[];
}

export type RoleProps = Partial<Omit<Role, 'guard_name' | 'created_at' | 'updated_at'>>;

export type RoleForm = Partial<Omit<Role, 'id' | 'created_at' | 'updated_at'>>;