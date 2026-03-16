import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { UserMenu } from "./UserMenu";

export function AnchorHome() {
  const [user, setUser] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const carregarUsuario = () => {
      const userString = localStorage.getItem("@LoginOne:user");
      if (userString) {
        setUser(JSON.parse(userString));
        setTrigger((prev) => prev + 1);
      } else {
        setUser(null);
      }
    };

    carregarUsuario();
    window.addEventListener("usuarioAtualizado", carregarUsuario);
    window.addEventListener("storage", carregarUsuario);

    return () => {
      window.removeEventListener("usuarioAtualizado", carregarUsuario);
      window.removeEventListener("storage", carregarUsuario);
    };
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="w-full py-4 px-8 flex justify-between items-center border-b border-zinc-100 bg-white relative z-40">
      <div className="flex items-center gap-1">
        <Flame className="text-brand fill-brand" />
        <Link to="/">
          <span className="font-bold text-xl text-zinc-800">LoginSystem</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 text-black">
        {user ? (
          <UserMenu user={user} />
        ) : (
          !isAuthPage && (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-medium text-zinc-600 hover:text-brand transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-brand text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-sm"
              >
                Começar Agora
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
}
