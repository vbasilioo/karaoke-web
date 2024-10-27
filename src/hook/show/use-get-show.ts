import { getShow } from "@/app/api/show/get-show";
import { IGetShowProps } from "@/interfaces/show";
import { useQuery } from "@tanstack/react-query";

export const useGetShow = () => {
  return useQuery<IGetShowProps>({
      queryKey: ['get-show'],
      queryFn: () => getShow(),
  });
};
