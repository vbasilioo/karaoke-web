import api from "@/app/services/api";
import { IGetUser } from "@/interfaces/user";
import { toast } from "sonner";

export async function createUser(formData: FormData) {
  try {
    const response = await api.post<IGetUser>('/user/store', formData);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error creating user:',
      error.response?.data || error.message || error
    );
    throw error;
  }
}