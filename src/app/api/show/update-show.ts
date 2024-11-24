import api from "@/app/services/api";
import { IUpdateShowProps } from "@/interfaces/show";
import { toast } from "sonner";

export async function updateShow(id: string, formData: FormData) {
  try {
    const response = await api.put<IUpdateShowProps>(
      `/show/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    toast.success(response.data.message);

    return response.data;
  } catch (error: any) {
    console.error(
      'Error fetching data:',
      error.response?.data || error.message || error,
    );

    toast.error(error.message);
  }
}
