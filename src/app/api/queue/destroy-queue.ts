import api from "@/app/services/api";
import { IDeleteQueue } from "@/interfaces/queue";
import { toast } from "sonner";

export async function destroyQueue(id: string, position: number){
    try{
        const response = await api.delete<IDeleteQueue>('/queue/', {
            data: {
                id: id,
                position: position
            }
        });

        toast.success('Usuário removido da fila com sucesso.');

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