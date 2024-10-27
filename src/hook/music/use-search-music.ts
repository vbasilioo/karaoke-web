import { searchMusic } from "@/app/api/music/search-music";
import { ISearchParamsRoot } from "@/interfaces/api";
import { ISearchYoutubeMusic } from "@/interfaces/music"
import { useQuery } from "@tanstack/react-query"

export const useSearchMusic = ({ search, page = 1, per_page = 10 }: ISearchParamsRoot) => {
  return useQuery<ISearchYoutubeMusic>({
    queryKey: ['search-music', search, page, per_page],
    queryFn: () => searchMusic({ search, page, per_page }),
    enabled: !!search,
  });
};
