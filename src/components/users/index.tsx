import { createUser } from "@/app/api/user/create-user";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { IUser } from "@/interfaces/user";
import { useGetAllUsers } from "@/hook/user/use-get-all-user";
import { getSession } from "next-auth/react";
import { Trash2, RefreshCcw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function Users() {
  const [session, setSession] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { data: users } = useGetAllUsers(session?.admin?.id ?? "");

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);
  
  const { mutateAsync: storeUser } = useMutation({
    mutationFn: createUser,
    mutationKey: ['create-user'],
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
      reset();
      setIsDialogOpen(false);
    },
  });

  const onSubmit = async (data: any) => {
    await storeUser(data);
  };

  const handleRestore = (showId: string) => {
    //
  };

  const handleDelete = (showId: string) => {
    //
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start space-y-6 p-6 text-center text-sm">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setIsDialogOpen(true)}>Cadastrar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Usuário</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col space-y-4 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <p className="text-xl font-medium">Nome de Usuário</p>
                <input
                  type="text"
                  className={`border p-2 rounded-md w-full ${errors.username ? 'border-red-500' : ''} bg-white text-black dark:text-black`}
                  placeholder="Digite o nome de usuário"
                  {...register("username", { required: "Nome de usuário é obrigatório." })}
                />
              </div>
              <div>
                <p className="text-xl font-medium">Telefone</p>
                <input
                  type="tel"
                  className={`border p-2 rounded-md w-full ${errors.telephone ? 'border-red-500' : ''} bg-white text-black dark:text-black`}
                  placeholder="Digite o telefone"
                  {...register("telephone", { required: "Telefone é obrigatório." })}
                />
              </div>
              <div>
                <p className="text-xl font-medium">Mesa</p>
                <input
                  type="text"
                  className={`border p-2 rounded-md w-full ${errors.table ? 'border-red-500' : ''} bg-white text-black dark:text-black`}
                  placeholder="Digite o número da mesa"
                  {...register("table", { required: "Mesa é obrigatória." })}
                />
              </div>
              <div>
                <p className="text-xl font-medium">Código de Acesso</p>
                <input
                  type="text"
                  className={`border p-2 rounded-md w-full ${errors.code_access ? 'border-red-500' : ''} bg-white text-black dark:text-black`}
                  placeholder="Digite o código de acesso da noite"
                  {...register("code_access", { required: "Código de acesso é obrigatório." })}
                />
              </div>
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    reset();
                  }}
                  type="button"
                  className="w-full bg-red-600 text-white font-bold"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full font-bold bg-green-600 text-white">
                  Cadastrar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex w-full">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center">Usuário</TableHead>
              <TableHead className="text-center">Telefone</TableHead>
              <TableHead className="text-center">Mesa</TableHead>
              <TableHead className="text-center">Show</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.data && users.data.data.length > 0 ? (
              users.data.data.map((user: IUser) => (
                <TableRow
                  key={user.id}
                  className={`text-center ${user.deleted_at ? 'bg-red-500' : 'bg-green-500'} font-bold`}
                >
                  <TableCell className="text-center">{user.username}</TableCell>
                  <TableCell className="text-center">{user.telephone}</TableCell>
                  <TableCell className="text-center">{user.table}</TableCell>
                  <TableCell className="text-center">{user.show.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {!user.deleted_at && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          aria-label="Excluir"
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}

                      {user.deleted_at && (
                        <button
                          onClick={() => handleRestore(user.id)}
                          aria-label="Restaurar"
                          className="p-2 text-green-500 hover:text-green-700"
                        >
                          <RefreshCcw size={20} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users?.data?.data ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum usuário encontrado.
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
