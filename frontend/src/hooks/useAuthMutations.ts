import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/context/AuthContext';
import { LoginRequest, RegisterRequest } from '@/types/auth.types';

export function useLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (response) => {
            login(response.token);
            navigate('/home')
        },
    });
}

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: () => {
            navigate('/login', { state: { registered: true } });
        },
    });
}

export function useLogout() {
    const { logout } = useAuth();
    return logout;
}
