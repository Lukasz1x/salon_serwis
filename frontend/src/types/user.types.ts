import {Location} from "@/types/location.types.ts";

export type UserRole = 'CLIENT' | 'ADMIN' | 'SALES_REP' | 'MECHANIC';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    location?: Location;
    createdAt: string;
    active: boolean;
}

export interface UserRequest {
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    password: string;
}