import {apiClient} from './AxiosClient.ts';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';

export const authApi = {
    login: (data: LoginRequest): Promise<LoginResponse> =>
        apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

    register: (data: RegisterRequest): Promise<string> =>
        apiClient.post<string>('/auth/register', data).then((r) => r.data),
};