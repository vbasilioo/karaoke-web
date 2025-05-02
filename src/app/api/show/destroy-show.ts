import api from "@/app/services/api";

export async function destroyShow(showId: string) {
    try {
        const response = await api.delete(`/show/delete/${showId}`);
        return response.data;
    } catch (error: any) {
        console.error(
            'Error fetching data:',
            error.response?.data || error.message || error,
        );
        throw new Error(error.response?.data.message || 'Error fetching data');
    }
}