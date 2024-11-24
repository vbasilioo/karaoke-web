import { useMutation } from "@tanstack/react-query";
import { destroyShow } from "@/app/api/show/destroy-show";
import { toast } from "sonner";

export const useDestroyShow = () => {
  return useMutation({
    mutationFn: destroyShow,
    onSuccess: () => {
      toast.success("Show deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar o show: ${error.message}`);
    },
  });
};
