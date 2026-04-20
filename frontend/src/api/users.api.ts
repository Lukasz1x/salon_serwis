import apiClient from './AxiosClient.ts';
import { User } from '../types/user.types';

export const usersApi = {
    getStats: () =>
        apiClient.get<User[]>('users/stats').then(r => r.data),

    changeRole: (userId: number, roleName: string) =>
        apiClient.put<User>(`/users/changeRole=${roleName}&userId=${userId}`).then(r => r.data),

    changeLocation: (userId: number, locationId?: number) =>
        apiClient.put<User>('/users/changeLocation', null, {
            params: { userId, locationId }
        }).then(r => r.data),

    deleteUser: (id: number) =>
        apiClient.delete(`/users/${id}`),
};