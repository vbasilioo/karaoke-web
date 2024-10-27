import { getShowByCodeAccess } from "@/app/api/show/get-show-by-id";
import { IGetShowByCodeAccess } from "@/interfaces/show"
import { useQuery } from "@tanstack/react-query"

export const useGetShowByCodeAccess = (code_access: string) => {
  return useQuery<IGetShowByCodeAccess>({
    queryKey: ['get-show-by-id'],
    queryFn: () => getShowByCodeAccess(code_access),
    enabled: !!code_access,
  });
}
