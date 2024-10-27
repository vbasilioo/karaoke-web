import api from "@/app/services/api"
import { ICreateShowProps } from "@/interfaces/show"
import { toast } from "sonner"

export async function createShow(formData: FormData){
  try{
    const response = await api.post<ICreateShowProps>(
      '/show',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    toast.success(response.data.message);

    return response.data;
  }catch(error: any){
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    )

    toast.error(error.message)
  }
}
