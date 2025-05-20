import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Mic2, Tv2, UserCheck2, Music2, UserRoundPlus, MicIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export function Sidebar() {
  const [activePage, setActivePage] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTemporaryUser, setIsTemporaryUser] = useState(false);
  const [temporaryUserValue, setTemporaryUserValue] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { pathname, search } = window.location;
      setActivePage(pathname);
      const urlParams = new URLSearchParams(search);
      const tempUser = urlParams.get("temporaryUser");
      setIsTemporaryUser(!!tempUser);
      setTemporaryUserValue(tempUser || "");
    }
  }, []);

  const handleClick = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  // Função para navegar mantendo o temporaryUser na URL, se existir
  const navigateWithTemporaryUser = (basePath: string) => {
    let url = basePath;
    if (isTemporaryUser && temporaryUserValue) {
      url = `${basePath}?temporaryUser=${temporaryUserValue}`;
    }
    router.push(url);
    setActivePage(basePath);
    setMobileMenuOpen(false);
  };

  const linkClasses = (page: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activePage === page
      ? "bg-zinc-800 text-white"
      : "text-white hover:text-white hover:bg-zinc-700"
    }`;

  const showAdminOptions = session?.role === 'admin' && !isTemporaryUser;

  return (
    <div className={`border-r bg-zinc-900 ${isMobileMenuOpen ? "block md:hidden" : "hidden"} md:block`}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-zinc-700 px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <Mic2 className="h-6 w-6 text-white" />
            <span>OpenMic</span>
          </Link>
          <button
            className="ml-auto md:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
        <nav className={`grid items-start px-2 text-sm font-medium lg:px-4 ${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
          {showAdminOptions && (
            <>
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
            </>
          )}
          <button
            className={linkClasses("/admin-musica")}
            onClick={() => navigateWithTemporaryUser("/admin-musica")}
            style={{ textAlign: "left" }}
          >
            <Music2 className="h-4 w-4" />
            Músicas
          </button>
          <button
            className={linkClasses("/fila")}
            onClick={() => navigateWithTemporaryUser("/fila")}
            style={{ textAlign: "left" }}
          >
            <UserRoundPlus className="h-4 w-4" />
            Fila
          </button>
          {showAdminOptions && (
            <Link href="/televisao" legacyBehavior>
              <a
                target="_blank"
                className={linkClasses("/televisao")}
                onClick={() => handleClick("/televisao")}
              >
                <Tv2 className="h-4 w-4" />
                TV
              </a>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}