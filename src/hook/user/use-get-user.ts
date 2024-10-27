import { getUser } from "@/app/api/user/get-user";
import { IGetUser } from "@/interfaces/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (showId: string) => {
  return useQuery<IGetUser>({
    queryKey: ['get-user'],
    queryFn: () => getUser(showId),
    enabled: !!showId
  });
};
