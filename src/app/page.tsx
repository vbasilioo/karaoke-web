"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Home() {
  const [popoverText, setPopoverText] = useState<string | JSX.Element>("");

  const handlePopoverClick = (text: string | JSX.Element) => {
    setPopoverText(text);
  };

  return (
    <div className="w-full bg-zinc-900">
      <nav className="w-full bg-zinc-900 text-white z-10">
        <div className="container mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-8">
            <Popover>
              <PopoverTrigger asChild>
                <button onClick={() => handlePopoverClick("Bem-vindo à Home!")}>
                  <span className="hover:underline font-bold cursor-pointer">Home</span>
                </button>
              </PopoverTrigger>
              <PopoverContent>{popoverText}</PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button onClick={() => handlePopoverClick("O Open Mic é uma plataforma feita para garantir que todos possam se divertir cantando. Ele organiza a ordem dos cantores de maneira justa, usando uma estrutura de fila, para que todos tenham a chance de participar e mostrar seu talento. Assim, você aproveita a experiência ao máximo, sabendo que todos terão a oportunidade de brilhar!")}>
                  <span className="hover:underline font-bold cursor-pointer">Sobre</span>
                </button>
              </PopoverTrigger>
              <PopoverContent>{popoverText}</PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={() =>
                    handlePopoverClick(
                      <>
                        <p className="font-semibold">Perguntas Frequentes:</p>
                        <ul className="list-disc pl-4 space-y-2">
                          <li>Como posso entrar na fila para cantar?</li>
                          <li>Posso adicionar mais de uma música à fila?</li>
                          <li>O que acontece se eu perder minha vez?</li>
                          <li>Existe um limite de tempo para cada apresentação?</li>
                          <li>Posso compartilhar minhas gravações com amigos?</li>
                        </ul>
                      </>
                    )
                  }
                >
                  <span className="hover:underline font-bold cursor-pointer">FAQ</span>
                </button>
              </PopoverTrigger>
              <PopoverContent>{popoverText}</PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={() =>
                    handlePopoverClick(
                      <>
                        <p className="flex items-center space-x-2">
                          <Mail className="w-5 h-5" />
                          <span>contato@openmic.com</span>
                        </p>
                      </>
                    )
                  }
                >
                  <span className="hover:underline font-bold cursor-pointer">Contato</span>
                </button>
              </PopoverTrigger>
              <PopoverContent>{popoverText}</PopoverContent>
            </Popover>
          </div>
          <Button asChild>
            <Link href="/auth/administrador-entrar" className="text-white bg-zinc-900 font-bold py-2 px-4 border-2 border-transparent bg-clip-padding bg-gradient-to-r from-pink-500 to-blue-500 rounded-full">
              Painel Administrativo
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
