import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import { useRestoreShow } from "@/hook/show/use-restore-show";
import { useDestroyShow } from "@/hook/show/use-destroy-show";
import { createShow } from "@/app/api/show/create-show";
import { updateShow } from "@/app/api/show/update-show";
import { IUser } from "@/interfaces/user";
import { Skeleton } from "../ui/skeleton";

export function Show() {
  const [session, setSession] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<IShow | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      console.log(sessionData);
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const { data: shows } = useGetShow(session?.admin?.id ?? "");
  const { mutateAsync: restoreShow } = useRestoreShow();
  const { mutateAsync: destroyShow } = useDestroyShow();

  const { mutateAsync: storeShow } = useMutation({
    mutationFn: createShow,
    mutationKey: ['create-show'],
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
      reset();
      setIsSubmitting(false);
      setIsDialogOpen(false);
    },
  });

  const { mutateAsync: editShow } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateShow(id, formData),
    mutationKey: ['edit-show'],
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
      reset();
      setIsSubmitting(false);
      setIsDialogOpen(false);
    },
  });

  const onSubmit = async (data: any) => {
    if (!session?.admin?.id) {
      return;
    }
  
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("hour_start", data.hour_start);
    formData.append("hour_end", data.hour_end);
    formData.append("date_show", data.date_show);
    formData.append("type", data.type);
    formData.append("admin_id", session.admin.id);
  
    try {
      if (selectedShow) {
        await editShow({ id: selectedShow.id, formData });
        toast.success("Show atualizado com sucesso!");
      } else {
        await storeShow(formData);
        toast.success("Show cadastrado com sucesso!");
      }
    } catch (error: any) {
      toast.error("Erro ao salvar o show!");
    } finally {
      setIsSubmitting(false);
      setSelectedShow(null);
    }
  };

  const handleEdit = (show: IShow) => {
    setSelectedShow(show);
    setIsDialogOpen(true);

    setValue("name", show.name);
    setValue("hour_start", show.hour_start);
    setValue("hour_end", show.hour_end);
    setValue("date_show", show.date_show);
    setValue("type", show.type);
  };

  const handleRestore = (showId: string) => {
    restoreShow(showId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
    });
  };

  const handleDelete = (showId: string) => {
    destroyShow(showId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['get-show'] });
    });
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 text-center p-4 md:p-8 text-xs md:text-sm lg:text-base">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-xl md:text-2xl font-bold">Shows</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) reset();
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setIsDialogOpen(true);
                setSelectedShow(null);
              }} 
              className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm"
            >
              Cadastrar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs md:max-w-md">
            <DialogTitle>{selectedShow ? "Editar Show" : "Cadastrar Novo Show"}</DialogTitle>
            <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="w-full">
                  <p className="text-base font-bold">Nome da Noite</p>
                  <input
                    type="text"
                    className={`border p-1 md:p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Digite o nome"
                    {...register("name", { required: "O nome é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-base font-bold">Horário de Início</p>
                  <input
                    type="time"
                    className={`border p-1 md:p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.hour_start ? 'border-red-500' : ''}`}
                    {...register("hour_start", { required: "Horário de início é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-base font-bold">Horário de Término</p>
                  <input
                    type="time"
                    className={`border p-1 md:p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.hour_end ? 'border-red-500' : ''}`}
                    {...register("hour_end", { required: "Horário de término é obrigatório." })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-base font-bold">Data do Show</p>
                  <input
                    type="date"
                    className={`border p-1 md:p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.date_show ? 'border-red-500' : ''}`}
                    {...register("date_show", { required: "A data do show é obrigatória." })}
                  />
                </div>
              </div>

              <div className="w-full">
                <p className="text-base font-bold">Tipo de Show</p>
                <select
                  className={`border p-1 md:p-2 rounded-md w-full dark:text-black dark:bg-white ${errors.type ? 'border-red-500' : ''}`}
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

              <div className="flex justify-between space-x-2">
                <Button onClick={() => setIsDialogOpen(false)} type="button" className="w-full bg-red-600 text-white font-bold text-xs md:text-sm">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold text-xs md:text-sm">
                  {isSubmitting ? <Loading /> : selectedShow ? "Editar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nome do Show</TableHead>
            <TableHead className="text-center">Data</TableHead>
            <TableHead className="text-center">Hora Início</TableHead>
            <TableHead className="text-center">Hora Fim</TableHead>
            <TableHead className="text-center">Código de Acesso</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shows?.data && shows.data.length > 0 ? (
            shows.data.map((show: IShow) => (
              <TableRow
                key={show.id}
                className={`text-center ${show.deleted_at ? 'bg-red-500' : 'bg-green-500'} font-bold`}
              >
                <TableCell className="text-center">{show.name}</TableCell>
                <TableCell className="text-center">{formatFullDate(show.date_show)}</TableCell>
                <TableCell className="text-center">{show.hour_start}</TableCell>
                <TableCell className="text-center">{show.hour_end}</TableCell>
                <TableCell className="text-center">{show.code_access}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  {!show.deleted_at && (
                    <button
                      onClick={() => handleDelete(show.id)}
                      aria-label="Excluir"
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  {show.deleted_at && (
                    <button
                      onClick={() => handleRestore(show.id)}
                      aria-label="Restaurar"
                      className="p-2 text-green-500 hover:text-green-700"
                    >
                      <RefreshCcw size={20} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : shows?.data ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum show encontrado.
              </TableCell>
            </TableRow>
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
