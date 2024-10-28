import { adjustQueue } from "@/app/api/music/adjust-queue";
import { IGetMusicProps } from "@/interfaces/music"
import { useQuery } from "@tanstack/react-query"

export const useAdjustQueueMusic = () => {
  return useQuery<IGetMusicProps>({
    queryKey: ['adjust-queue'],
    queryFn: () => adjustQueue(),
  });
}
