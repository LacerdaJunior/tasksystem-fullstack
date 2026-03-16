import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { ProfileModal } from "./PerfilModal";

export function UserMenu({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("@LoginOne:token");
    localStorage.removeItem("@LoginOne:user");
    window.dispatchEvent(new Event("usuarioAtualizado"));
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative">
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-zinc-50 py-1.5 px-3 rounded-full border border-zinc-100"
        >

          <div className="w-8 h-8 rounded-full border-2 border-brand overflow-hidden bg-white flex items-center justify-center shadow-sm">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`Avatar de ${user.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={16} className="text-brand/50" />
            )}
          </div>

          <span className="font-semibold text-brand text-sm">
            {user.name.split(" ")[0]}
          </span>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

            <button
              onClick={handleOpenProfile}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors text-left"
            >
              <Settings size={16} />
              Meu Perfil
            </button>

            <div className="w-full h-px bg-zinc-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <LogOut size={16} />
              Sair da Conta
            </button>
          </div>
        )}
      </div>

      {isModalOpen && <ProfileModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
