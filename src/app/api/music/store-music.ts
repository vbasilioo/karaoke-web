import api from "@/app/services/api";
import { IGetMusicProps } from "@/interfaces/music";
import { toast } from "sonner";

export async function storeMusic(formData: FormData){
  try{
    const response = await api.post<IGetMusicProps>(
      '/music/store',
      formData,
      {
        headers: {
          'Content-Type':'multipart/form-data',
        },
      },
    );

    toast.success(response.data.message);

    return response.data;
  }catch(error: any){
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
