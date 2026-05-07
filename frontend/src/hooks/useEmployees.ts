import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export const useSalesRepsByLocation = (locationId: number | '') => {
    return useQuery({
        queryKey: ['employees', 'SALES_REP', locationId],
        queryFn: () => usersApi.getEmployeesByLocationAndRole(Number(locationId), 'SALES_REP'),
        enabled: !!locationId,
    });
};

export const useMechanicsByLocation = (locationId: number | '') => {
    return useQuery({
        queryKey: ['employees', 'MECHANIC', locationId],
        queryFn: () => usersApi.getEmployeesByLocationAndRole(Number(locationId), 'MECHANIC'),
        enabled: !!locationId,
    });
};