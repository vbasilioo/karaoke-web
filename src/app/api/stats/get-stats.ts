import api from "@/app/services/api";
import { IGetStats } from "@/interfaces/stats";
import { toast } from "sonner";

export async function getStats(){
    try{
        const response = await api.get<IGetStats>('/stats?page=1&per_page=10');

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