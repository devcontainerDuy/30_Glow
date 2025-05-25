export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface RoleProps {
    id: number;
    name: string;
}

export type RoleForm = {
    name: string;
    guard_name: string;
};
