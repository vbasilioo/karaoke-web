import api from "@/app/services/api";
import { IGetUser } from "@/interfaces/user";

export async function getAllUsers(adminID: string){
    try{
        const response = await api.get<IGetUser>('/user', {
            params: {
                admin_id: adminID
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