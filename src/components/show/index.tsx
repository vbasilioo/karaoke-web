import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShow } from "@/app/api/show/create-show";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Loading } from "../global/loading";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useGetShow } from "@/hook/show/use-get-show";
import { IShow } from "@/interfaces/show";
import { formatFullDate } from "@/lib/utils";

export function Show() {
  const session = await getSession();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { data: shows } = useGetShow(session?.admin.id);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: storeShow } = useMutation({
    mutationFn: createShow,
    mutationKey: ['create-show'],
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
      reset();
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const showData = {
      ...data,
      admin_id: session?.admin.id,
    };

    try {
      await storeShow(showData);
      toast.success("Show cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar o show!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 text-center p-4 md:p-8 text-sm">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Shows</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Cadastrar Show</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Cadastrar Novo Show</DialogTitle>
            <form className="flex flex-col space-y-4 w-full max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="w-full">
                  <p className="text-lg font-bold">Nome da Noite</p>
                  <input
                    type="text"
                    className={`border p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Digite o nome"
                    {...register("name", { required: "O nome é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-lg font-bold">Horário de Início</p>
                  <input
                    type="time"
                    className={`border p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.hour_start ? 'border-red-500' : ''}`}
                    {...register("hour_start", { required: "Horário de início é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-lg font-bold">Horário de Término</p>
                  <input
                    type="time"
                    className={`border p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.hour_end ? 'border-red-500' : ''}`}
                    {...register("hour_end", { required: "Horário de término é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-lg font-bold">Data do Show</p>
                  <input
                    type="date"
                    className={`border p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.date_show ? 'border-red-500' : ''}`}
                    {...register("date_show", { required: "A data do show é obrigatória." })}
                  />
                </div>
              </div>

              <div className="w-full">
                <p className="text-lg font-bold">Tipo de Show</p>
                <select
                  className={`border p-2 rounded-md w-full text-white dark:text-black dark:bg-white ${errors.type ? 'border-red-500' : ''}`}
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

              <div className="flex justify-between space-x-4">
                <Button onClick={() => setIsDialogOpen(false)} type="button" className="w-full bg-red-600 text-white font-bold">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full font-bold bg-green-600 text-white">
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loading />
                      Cadastrando...
                    </span>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full overflow-x-auto mx-auto">
        <Table>
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
