import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export const useUsers = () =>
    useQuery({
        queryKey: ['users'],
        queryFn: usersApi.getStats,
    });

export const useChangeRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
            usersApi.changeRole(userId, roleName),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
};

export const useChangeLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, locationId }: { userId: number; locationId?: number }) =>
            usersApi.changeLocation(userId, locationId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => usersApi.deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
};
