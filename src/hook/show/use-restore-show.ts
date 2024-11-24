import { useMutation } from "@tanstack/react-query";
import { restoreShow } from "@/app/api/show/restore-show";
import { toast } from "sonner";

export const useRestoreShow = () => {
  return useMutation({
    mutationFn: restoreShow,
    onSuccess: () => {
      toast.success("Show restaurado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao restaurar o show: ${error.message}`);
    },
  });
};
