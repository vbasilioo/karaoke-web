import api from "@/app/services/api";
import { IGetShowProps } from "@/interfaces/show";
import { toast } from "sonner";

export async function getShow(adminId: string){
  try{
    const response = await api.get<IGetShowProps>('/show', {
      params: {
        admin_id: adminId
      }
    });

    return response.data;
  }catch(error: any){
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );

    throw new Error(error.response?.data.message || 'Error fetching data');
  }
}
