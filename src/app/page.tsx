"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Menu } from "lucide-react";

export default function Home() {
  const [popoverText, setPopoverText] = useState<string | JSX.Element>("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { label: "Home", content: "Bem-vindo à Home!" },
    {
      label: "Sobre",
      content:
        "O Open Mic é uma plataforma feita para garantir que todos possam se divertir cantando. Ele organiza a ordem dos cantores de maneira justa, usando uma estrutura de fila, para que todos tenham a chance de participar e mostrar seu talento.",
    },
    {
      label: "FAQ",
      content: (
        <>
          <p className="font-semibold">Perguntas Frequentes:</p>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            <li>Como posso entrar na fila para cantar?</li>
            <li>Posso adicionar mais de uma música à fila?</li>
            <li>O que acontece se eu perder minha vez?</li>
            <li>Existe um limite de tempo para cada apresentação?</li>
            <li>Posso compartilhar minhas gravações com amigos?</li>
          </ul>
        </>
      ),
    },
    {
      label: "Contato",
      content: (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>contato@openmic.com</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <nav className="w-full backdrop-blur-sm bg-zinc-900/80 border-b border-zinc-800">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <button
            className="lg:hidden text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ label, content }) => (
              <Popover key={label}>
                <PopoverTrigger asChild>
                  <button onClick={() => setPopoverText(content)}>
                    <span className="hover:underline cursor-pointer">{label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-zinc-900 text-sm text-white border-zinc-700 max-w-xs">
                  {popoverText}
                </PopoverContent>
              </Popover>
            ))}
          </div>

          <Button asChild className="text-white font-bold py-2 px-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition">
            <Link href="/auth/administrador-entrar">Painel Administrativo</Link>
          </Button>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden px-6 py-4 space-y-4">
            {navLinks.map(({ label, content }) => (
              <Popover key={label}>
                <PopoverTrigger asChild>
                  <button
                    className="block w-full text-left hover:underline"
                    onClick={() => setPopoverText(content)}
                  >
                    {label}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-zinc-900 text-sm text-white border-zinc-700 max-w-xs">
                  {popoverText}
                </PopoverContent>
              </Popover>
            ))}
          </div>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="flex items-center justify-center px-6 py-16 animate-fade-in">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white drop-shadow">
              Bem-vindo ao <span className="text-pink-400">OPEN MIC</span>
            </h1>
            <p className="text-zinc-300 text-base">
              A plataforma perfeita para soltar a voz e animar qualquer evento.
              Entre na fila, escolha sua música e brilhe no palco!
            </p>
            <Button asChild className="w-full text-lg font-bold rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition">
              <Link href="/auth/entrar-temporariamente">Solte a voz agora!</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center bg-zinc-800">
          <Image
            src="/background-home.jpg"
            alt="Ilustração de apresentação"
            width={800}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
