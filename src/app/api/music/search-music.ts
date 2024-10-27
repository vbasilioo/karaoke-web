import api from "@/app/services/api";
import { ISearchParamsRoot } from "@/interfaces/api";
import { ISearchYoutubeMusic } from "@/interfaces/music";
import { toast } from "sonner";

export async function searchMusic({ search }: ISearchParamsRoot) {
  try {
    const response = await api.get<ISearchYoutubeMusic>('/music/search', {
      params: { query: search }
    });

    return response.data;
  } catch (error: any) {
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );
    if (error.response.data.message) toast.error(error.response.data.message);

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
