import { getMusic } from "@/app/api/music/get-music"
import { IGetQueueMusicsProps } from "@/interfaces/music"
import { useQuery } from "@tanstack/react-query"

export const useGetQueueMusic = () => {
  return useQuery<IGetQueueMusicsProps>({
    queryKey: ['queue-music'],
    queryFn: () => getMusic(),
  })
}
