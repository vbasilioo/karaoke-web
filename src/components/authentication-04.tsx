import Image from "next/image";
import Link from "next/link";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema } from "@/schemas/auth";
import { useForm } from 'react-hook-form';
import { LoginFormData } from "@/interfaces/admin";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const router = useRouter();

  async function handleSignInCredentials(data: LoginFormData) {
    const { email, password } = data;

    toast.loading('Realizando login...', { id: 'sign-in' });

    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      toast.dismiss('sign-in');
      toast.error(response.error);
      return;
    }

    toast.success('Login realizado com sucesso.', { id: 'sign-in' });
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit(handleSignInCredentials)} className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-balance text-muted-foreground">
                Entre com seu e-mail e sua senha.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="thays.vasquez@gmail.com"
                  required
                  {...register("email")}
                  className="bg-zinc-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                  className="bg-zinc-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" className="w-full border-2 border-transparent bg-clip-padding bg-gradient-to-r from-pink-500 to-blue-500 rounded text-white font-bold" disabled={isSubmitting}>
                Entrar
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block h-screen w-screen">
          <Image
            src="/login-background.jpg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </form>
  );
}
