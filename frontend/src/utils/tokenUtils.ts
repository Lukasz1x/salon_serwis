import { JwtPayload, UserRole } from '@/types/auth.types';

const TOKEN_KEY = 'auth_token';

export function decodeToken(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload) as JwtPayload;
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
}

export function extractRole(token: string): UserRole | null {
    const payload = decodeToken(token);
    if (!payload?.role) return null;

    const roleName = payload.role.replace('ROLE_', '') as UserRole;
    const validRoles: UserRole[] = ['CLIENT', 'ADMIN', 'SALES_REP', 'MECHANIC'];
    return validRoles.includes(roleName) ? roleName : null;
}

export function extractEmail(token: string): string | null {
    return decodeToken(token)?.sub ?? null;
}

export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}