import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AuthState, UserRole } from '@/types/auth.types';
import {
    saveToken,
    removeToken,
    getToken,
    extractRole,
    extractEmail,
    isTokenExpired,
} from '@/utils/tokenUtils';

interface AuthContextValue extends AuthState {
    login: (token: string) => void;
    logout: () => void;
    hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [authState, setAuthState] = useState<AuthState>(() => {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
            return {
                token,
                email: extractEmail(token),
                role: extractRole(token),
                isAuthenticated: true,
            };
        }
        removeToken();
        return { token: null, email: null, role: null, isAuthenticated: false };
    });

    const login = useCallback((token: string) => {
        saveToken(token);
        setAuthState({
            token,
            email: extractEmail(token),
            role: extractRole(token),
            isAuthenticated: true,
        });
    }, []);

    const logout = useCallback(() => {
        removeToken();
        queryClient.clear();
        setAuthState({ token: null, email: null, role: null, isAuthenticated: false });
        navigate('/login');
    }, [navigate, queryClient]);

    const hasRole = useCallback(
        (role: UserRole | UserRole[]): boolean => {
            if (!authState.role) return false;
            return Array.isArray(role)
                ? role.includes(authState.role)
                : authState.role === role;
        },
        [authState.role]
    );

    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth musi być używany wewnątrz <AuthProvider>');
    }
    return context;
}