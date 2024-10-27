import { createUser } from "@/app/api/user/create-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const router = useRouter();

  const { mutateAsync: storeUser } = useMutation({
    mutationFn: createUser,
    mutationKey: ['create-user'],
    async onSuccess(data) {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['create-user'] });
        router.push('/musica');
        reset();
      }
    },
    async onError() {
      toast.error('Falha ao criar um usuário temporário.');
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await storeUser(data);
      console.log(result);
    } catch (error: any) {
      console.error(
        'Error processing form:',
        error.response?.data || error.message || error,
      );
      toast.error('Falha ao processar o formulário.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Entre com um nome de usuário temporário.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nome</Label>
              <Input
                id="username"
                type="text"
                placeholder="Thays"
                {...register("username", { required: "Nome é obrigatório" })}
              />

              <Label htmlFor="table">Mesa</Label>
              <Input
                id="table"
                type="number"
                placeholder="10"
                {...register("table", { required: "Mesa é obrigatória" })}
              />

              <Label htmlFor="telephone">Telefone</Label>
              <Input
                id="telephone"
                type="text"
                placeholder="(12) 99999-9999"
                {...register("telephone")}
              />

              <Label htmlFor="code_access">Código de acesso</Label>
              <Input
                id="code_access"
                type="password"
                placeholder="123456"
                {...register("code_access", { required: "Código de acesso é obrigatório" })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Entrar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
