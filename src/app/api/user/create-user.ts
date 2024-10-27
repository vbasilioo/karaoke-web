import api from "@/app/services/api";
import { IGetUser } from "@/interfaces/user";
import { toast } from "sonner";

export async function createUser(formData: FormData) {
  try {
    const response = await api.post<IGetUser>(
      '/user',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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

    toast.error(error.response?.data?.message || 'Erro ao criar usuário.');
    return null;
  }
}
