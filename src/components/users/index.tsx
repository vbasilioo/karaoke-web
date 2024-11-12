import { createUser } from "@/app/api/user/create-user";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { IUser } from "@/interfaces/user";
import { useGetAllUsers } from "@/hook/user/use-get-all-user";

export function Users() {
  const [codeAccess, setCodeAccess] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { data: users } = useGetAllUsers();
  
  const { mutateAsync: storeUser } = useMutation({
    mutationFn: createUser,
    mutationKey: ['create-user'],
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
      reset();
    },
  });

  const onSubmit = async (data: any) => {
    setCodeAccess(data.code_access);
    await storeUser(data);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start space-y-6 p-6 text-center text-sm">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Cadastrar</Button>
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
                  className={`border p-2 rounded-md w-full ${errors.username ? 'border-red-500' : ''} bg-gray-800 text-gray-200`}
                  placeholder="Digite o nome de usuário"
                  {...register("username", { required: "Nome de usuário é obrigatório." })}
                />
              </div>

              <div>
                <p className="text-xl font-medium">Telefone</p>
                <input
                  type="tel"
                  className={`border p-2 rounded-md w-full ${errors.telephone ? 'border-red-500' : ''} bg-gray-800 text-gray-200`}
                  placeholder="Digite o telefone"
                  {...register("telephone", { required: "Telefone é obrigatório." })}
                />
              </div>

              <div>
                <p className="text-xl font-medium">Mesa</p>
                <input
                  type="text"
                  className={`border p-2 rounded-md w-full ${errors.table ? 'border-red-500' : ''} bg-gray-800 text-gray-200`}
                  placeholder="Digite o número da mesa"
                  {...register("table", { required: "Mesa é obrigatória." })}
                />
              </div>

              <div>
                <p className="text-xl font-medium">Código de Acesso</p>
                <input
                  type="text"
                  className={`border p-2 rounded-md w-full ${errors.code_access ? 'border-red-500' : ''} bg-gray-800 text-gray-200`}
                  placeholder="Digite o código de acesso da noite"
                  {...register("code_access", { required: "Código de acesso é obrigatório." })}
                />
              </div>

              <div className="flex justify-between space-x-4">
                <Button onClick={() => reset()} type="button" className="w-full bg-red-600 text-white font-bold">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.data.map((user: IUser) => (
              <TableRow key={user.id} className="text-center">
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center">{user.telephone}</TableCell>
                <TableCell className="text-center">{user.table}</TableCell>
                <TableCell className="text-center">{user.show.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
