import api from "@/app/services/api";
import { IMeUser } from "@/interfaces/user";

export async function getMe(userID: string){
    try{
        const response = await api.get<IMeUser>(`/user/me/${userID}`);

        return response.data;
    }catch(error: any){
        console.error(
            'Error fetching data:',
            error.response?.data || error.message || error,
        );
      
        throw new Error(error.response?.data.message || 'Error fetching data');
    }
}