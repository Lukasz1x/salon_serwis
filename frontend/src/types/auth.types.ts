export type UserRole = 'CLIENT' | 'ADMIN' | 'SALES_REP' | 'MECHANIC';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface JwtPayload {
    sub: string;          // email
    role: string;
    iat: number;
    exp: number;
}

export interface AuthState {
    token: string | null;
    email: string | null;
    role: UserRole | null;
    isAuthenticated: boolean;
}