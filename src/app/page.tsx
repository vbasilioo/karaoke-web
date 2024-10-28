import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full bg-zinc-900">
      <nav className="w-full bg-zinc-900 text-white z-10">
        <div className="container mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="hover:underline font-bold">Home</Link>
            <Link href="/about" className="hover:underline font-bold">Sobre</Link>
            <Link href="/faq" className="hover:underline font-bold">FAQ</Link>
            <Link href="/contact" className="hover:underline font-bold">Contato</Link>
          </div>
          <Button asChild>
            <Link href="/auth/administrador-entrar" className="text-white bg-zinc-900 font-bold py-2 px-4 border-2 border-transparent bg-clip-padding bg-gradient-to-r from-pink-500 to-blue-500 rounded-full">
              Login
            </Link>
          </Button>
        </div>
      </nav>
      <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center py-8">
          <div className="mx-auto grid w-[320px] gap-4">
            <div className="grid gap-2 text-center">
              <h1 className="text-4xl font-bold text-white">Bem vindo ao OPEN MIC</h1>
            </div>
            <div className="grid gap-4">
              <Button type="submit" className="w-full border-2 border-transparent bg-clip-padding bg-gradient-to-r from-pink-500 to-blue-500 rounded text-white font-bold" asChild>
                <Link href="/create-account/register">
                  Solte a voz e anime sua festa!
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-muted">
          <Image
            src={"/background-home.jpg"}
            alt="Background Home"
            width={800}
            height={800}
            className="h-auto w-full object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
