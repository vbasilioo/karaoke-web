import { destroyQueue } from "@/app/api/queue/destroy-queue";
import { IDeleteQueue } from "@/interfaces/queue";
import { useMutation } from "@tanstack/react-query";

export const useDestroyQueue = () => {
    return useMutation<IDeleteQueue, unknown, { id: string; position: number }>({
        mutationFn: ({ id, position }) => destroyQueue(id, position),
    });
};
