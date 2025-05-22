export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export type RoleProps = {
    id: number;
    name: string;
}
