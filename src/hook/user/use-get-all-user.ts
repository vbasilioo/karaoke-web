import { getAllUsers } from "@/app/api/user/get-users";
import { IGetUser } from "@/interfaces/user"
import { useQuery } from "@tanstack/react-query"

export const useGetAllUsers = (adminID: string) => {
    return useQuery<IGetUser>({
        queryKey: ['get-all-users'],
        queryFn: () => getAllUsers(adminID),
    });
}