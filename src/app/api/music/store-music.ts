import api from "@/app/services/api";
import { IGetMusicProps } from "@/interfaces/music";
import { toast } from "sonner";

export async function storeMusic(formData: FormData){
  try{
    const response = await api.post<IGetMusicProps>(
      '/music/',
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
    if (error.response.data.message) toast.error(error.response.data.message);

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
