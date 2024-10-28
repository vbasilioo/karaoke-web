import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Mic2, Tv2, UserCheck2, Music2, UserRoundPlus, MicIcon } from "lucide-react";
import { useRouter } from "next/router";

export function Sidebar() {
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { pathname } = window.location;
      setActivePage(pathname);
    }
  }, []);

  const handleClick = (page: string) => {
    setActivePage(page);
  };

  const linkClasses = (page: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      activePage === page
        ? "bg-zinc-800 text-white"
        : "text-muted-foreground hover:text-white hover:bg-zinc-700"
    }`;

  return (
    <div className="hidden border-r bg-zinc-900 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-zinc-700 px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <Mic2 className="h-6 w-6 text-white" />
            <span>OpenMic</span>
          </Link>
        </div>
        <nav className="grid items-start px-2 text-sm font-medium text-muted-foreground lg:px-4">
          <Link href="/dashboard" className={linkClasses("/dashboard")} onClick={() => handleClick("/dashboard")}>
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/show" className={linkClasses("/show")} onClick={() => handleClick("/show")}>
            <MicIcon className="h-4 w-4" />
            Shows
          </Link>
          <Link href="/usuarios" className={linkClasses("/usuarios")} onClick={() => handleClick("/usuarios")}>
            <UserCheck2 className="h-4 w-4" />
            Usuários
          </Link>
          <Link href="/musica" className={linkClasses("/musica")} onClick={() => handleClick("/musica")}>
            <Music2 className="h-4 w-4" />
            Músicas
          </Link>
          <Link href="/fila" className={linkClasses("/fila")} onClick={() => handleClick("/fila")}>
            <UserRoundPlus className="h-4 w-4" />
            Fila
          </Link>
          <Link href="/televisao" className={linkClasses("/televisao")} onClick={() => handleClick("/televisao")}>
            <Tv2 className="h-4 w-4" />
            TV
          </Link>
        </nav>
      </div>
    </div>
  );
}