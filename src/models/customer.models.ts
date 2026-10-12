export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerInput {
    name: string;
    email: string;
    phone?: string;
    birthDate?: Date;
}

export interface CustomerUpdateInput {
    name?: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
}
