import { createUser } from "@/app/api/user/create-user";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
      <h1 className="text-2xl font-bold">Cadastro de Usuário</h1>
      <form className="flex flex-col space-y-4 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-xl font-medium">Nome de Usuário</p>
          <input
            type="text"
            className={`border p-2 rounded-md w-full ${errors.username ? 'border-red-500' : ''}`}
            placeholder="Digite o nome de usuário"
            {...register("username", { required: "Nome de usuário é obrigatório." })}
          />
        </div>

        <div>
          <p className="text-xl font-medium">Telefone</p>
          <input
            type="tel"
            className={`border p-2 rounded-md w-full ${errors.telephone ? 'border-red-500' : ''}`}
            placeholder="Digite o telefone"
            {...register("telephone", { required: "Telefone é obrigatório." })}
          />
        </div>

        <div>
          <p className="text-xl font-medium">Mesa</p>
          <input
            type="text"
            className={`border p-2 rounded-md w-full ${errors.table ? 'border-red-500' : ''}`}
            placeholder="Digite o número da mesa"
            {...register("table", { required: "Mesa é obrigatória." })}
          />
        </div>

        <div>
          <p className="text-xl font-medium">Código de Acesso</p>
          <input
            type="text"
            className={`border p-2 rounded-md w-full ${errors.code_access ? 'border-red-500' : ''}`}
            placeholder="Digite o código de acesso da noite"
            {...register("code_access", { required: "Código de acesso é obrigatório." })}
          />
        </div>

        <Button type="submit">Criar</Button>
      </form>

      <div className="w-full mt-8" style={{ minHeight: '60%' }}>
        <Table>
          <TableCaption>Lista de Usuários Cadastrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Mesa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.data.map((user: IUser) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.telephone}</TableCell>
                <TableCell>{user.table}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
