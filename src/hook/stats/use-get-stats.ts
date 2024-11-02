import { getStats } from "@/app/api/stats/get-stats";
import { IGetStats } from "@/interfaces/stats"
import { useQuery } from "@tanstack/react-query"

export const useGetStats = () => {
    return useQuery<IGetStats>({
        queryKey: ['get-stats'],
        queryFn: () => getStats(),
    });
}