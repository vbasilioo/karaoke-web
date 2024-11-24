import { getMe } from "@/app/api/user/get-me";
import { IMeUser } from "@/interfaces/user";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = (userID: string) => {
    return useQuery<IMeUser>({
        queryKey: ['get-my-user'],
        queryFn: () => getMe(userID)
    });
};