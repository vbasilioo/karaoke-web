import api from "@/app/services/api";
import { IGetMusicProps } from "@/interfaces/music";
import { toast } from "sonner";

export async function adjustQueue(){
  try{
    const response = await api.get<IGetMusicProps>('/music/adjust-queue');

    return response.data;
  }catch(error: any){
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
