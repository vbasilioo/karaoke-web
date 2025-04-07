import api from "@/app/services/api";
import { IGetQueue } from "@/interfaces/queue";

export async function getQueue(adminId: string){
  try{
    const response = await api.get<IGetQueue>('/queue/index', {
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
