import { getQueue } from "@/app/api/queue/get-queue";
import { IGetQueue } from "@/interfaces/queue"
import { useQuery } from "@tanstack/react-query"

export const useGetQueue = (adminId: string) => {
  return useQuery<IGetQueue>({
      queryKey: ['get-queue'],
      queryFn: () => getQueue(adminId),
  });
}
