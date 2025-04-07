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
import { ChevronLeft } from "lucide-react";

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
    <div className="relative w-full h-screen">
      <Image
        src="/login-background.jpg"
        alt="Image"
        fill
        className="absolute object-cover top-0 left-0 w-full h-full z-0"
      />
      <div
        className="absolute top-4 left-4 z-10 p-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-md cursor-pointer transition duration-300 ease-in-out hover:from-pink-400 hover:to-blue-400"
        onClick={() => router.back()}
      >
        <ChevronLeft />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-zinc-900 bg-opacity-75 backdrop-blur-md p-8 rounded-lg shadow-lg w-[350px] text-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-balance text-muted-foreground">
              Entre com seu e-mail e sua senha.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignInCredentials)} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                {...register("email")}
                className="bg-zinc-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
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
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}
