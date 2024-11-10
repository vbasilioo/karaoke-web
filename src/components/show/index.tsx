import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShow } from "@/app/api/show/create-show";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Loading } from "../global/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetShow } from "@/hook/show/use-get-show";
import { IShow } from "@/interfaces/show";
import { formatFullDate } from "@/lib/utils";

export function Show() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { data: shows } = useGetShow();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: storeShow } = useMutation({
    mutationFn: createShow,
    mutationKey: ['create-show'],
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
      reset();
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const session = await getSession();

    const showData = {
      ...data,
      admin_id: session?.admin.id,
    };

    try {
      await storeShow(showData);
    } catch (error: any) {
      toast.error("Erro ao cadastrar o show!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 text-center p-4 md:p-8">
      <form className="flex flex-col space-y-4 w-full max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="w-full">
            <p className="text-lg font-medium">Nome da Noite</p>
            <input
              type="text"
              className={`border p-2 rounded-md w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Digite o nome"
              {...register("name", { required: "O nome é obrigatório." })}
            />
          </div>

          <div className="w-full">
            <p className="text-lg font-medium">Horário de Início</p>
            <input
              type="time"
              className={`border p-2 rounded-md w-full ${errors.hour_start ? 'border-red-500' : ''}`}
              {...register("hour_start", { required: "Horário de início é obrigatório." })}
            />
          </div>

          <div className="w-full">
            <p className="text-lg font-medium">Horário de Término</p>
            <input
              type="time"
              className={`border p-2 rounded-md w-full ${errors.hour_end ? 'border-red-500' : ''}`}
              {...register("hour_end", { required: "Horário de término é obrigatório." })}
            />
          </div>

          <div className="w-full">
            <p className="text-lg font-medium">Data do Show</p>
            <input
              type="date"
              className={`border p-2 rounded-md w-full ${errors.date_show ? 'border-red-500' : ''}`}
              {...register("date_show", { required: "A data do show é obrigatória." })}
            />
          </div>
        </div>

        <div className="w-full">
          <p className="text-lg font-medium">Tipo de Show</p>
          <select
            className={`border p-2 rounded-md w-full ${errors.type ? 'border-red-500' : ''}`}
            {...register("type", { required: "O tipo de show é obrigatório." })}
          >
            <option value="">Selecione o tipo</option>
            <option value="POP">POP</option>
            <option value="RAP">RAP</option>
            <option value="TRAP">TRAP</option>
            <option value="FUNK">FUNK</option>
            <option value="SERTANEJO">SERTANEJO</option>
            <option value="MPB">MPB</option>
            <option value="PAGODE">PAGODE</option>
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="relative w-full">
          {isSubmitting ? (
            <span className="flex items-center">
              <Loading />
              Cadastrando...
            </span>
          ) : (
            "Cadastrar Show"
          )}
        </Button>
      </form>

      <div className="w-full max-w-4xl min-h-[60vh] overflow-x-auto mx-auto">
        <Table>
          <TableCaption>Lista recente de shows cadastrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nome do Show</TableHead>
              <TableHead className="text-center">Hora do Início</TableHead>
              <TableHead className="text-center">Hora do Fim</TableHead>
              <TableHead className="text-center">Data do Show</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Código de Acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shows?.data.map((show: IShow) => (
              <TableRow key={show.id}>
                <TableCell className="text-center">{show.name}</TableCell>
                <TableCell className="text-center">{show.hour_start}</TableCell>
                <TableCell className="text-center">{show.hour_end}</TableCell>
                <TableCell className="text-center">{formatFullDate(show.date_show)}</TableCell>
                <TableCell className="text-center">{show.type}</TableCell>
                <TableCell className="text-right">{show.code_access}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
