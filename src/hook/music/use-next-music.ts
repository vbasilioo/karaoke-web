import { useQuery } from "@tanstack/react-query"

import { nextMusic } from "@/app/api/music/next-music";
import { IGetMusicProps } from "@/interfaces/music"

export const useNextMusic = () => {
  return useQuery<IGetMusicProps>({
    queryKey: ['next-music'],
    queryFn: () => nextMusic(),
  })
}
