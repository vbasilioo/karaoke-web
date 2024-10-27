import api from "@/app/services/api";
import { IGetQueueMusicsProps } from "@/interfaces/music";
import { toast } from "sonner";

export async function getMusic(){
  try {
    const response = await api.get<IGetQueueMusicsProps>('/music/');

    return response.data;
  }catch(error: any){
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );
    if (error.response.data.message) toast.error(error.response.data.message);

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
