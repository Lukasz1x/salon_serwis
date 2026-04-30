import {useQuery} from "@tanstack/react-query";
import {fetchSalonReport, fetchServiceReport} from "../api/report.api.ts";

export const useSalonReport = (begin: string, end: string) => {
    return useQuery({
        queryKey: ['salonReport', begin, end],
        queryFn: () => fetchSalonReport(begin, end),
        enabled: !!begin && !!end,
    });
};

export const useServiceReport = (begin: string, end: string) => {
    return useQuery({
        queryKey: ['serviceReport', begin, end],
        queryFn: () => fetchServiceReport(begin, end),
        enabled: !!begin && !!end,
    });
};