import Link from "next/link";
import { Bell, CircleUser, Menu, Search, Home, Mic2, Tv2, UserCheck2, Music2, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeChanger } from "../theme/theme-change";
import { signOut } from "next-auth/react";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-700 bg-zinc-900 px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menu de navegação</span>
            </Button>
          </SheetTrigger>

          {/* Sidebar Mobile Content */}
          <SheetContent side="left" className="flex flex-col bg-zinc-900 p-4 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Mic2 className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold">OpenMic</span>
            </div>

            <nav className="flex flex-col gap-3">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/show" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <Mic2 className="h-5 w-5" />
                Shows
              </Link>
              <Link href="/usuarios" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <UserCheck2 className="h-5 w-5" />
                Usuários
              </Link>
              <Link href="/musica" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <Music2 className="h-5 w-5" />
                Músicas
              </Link>
              <Link href="/fila" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <UserRoundPlus className="h-5 w-5" />
                Fila
              </Link>
              <Link href="/televisao" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-700">
                <Tv2 className="h-5 w-5" />
                TV
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <ThemeChanger />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Alternar menu do usuário</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
