import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { Tag, Plus, Trash2, Palette } from "lucide-react";

export function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366F1");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/dashboard/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("O nome é obrigatório!");
    setIsLoading(true);
    const loadingToast = toast.loading("A criar...");

    try {
      await api.post("/dashboard/categories", { name, color });
      toast.success("Categoria criada!", { id: loadingToast });
      setName("");
      setColor("#6366F1");
      fetchCategories();
    } catch (error) {
      toast.error("Erro ao criar.", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-space">
          <span className="font-semibold text-sm text-zinc-800 text-center">
            Excluir a etiqueta "{categoryName}" permanentemente?
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("A excluir...");
                try {
                  await api.delete(`/dashboard/categories/${categoryId}`);
                  toast.success("Excluída com sucesso!", { id: loadingToast });
                  setCategories(
                    categories.filter((cat) => cat.id !== categoryId)
                  );
                } catch (error) {
                  toast.error("Erro ao excluir.", { id: loadingToast });
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold w-full transition-colors"
            >
              Excluir
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-xs font-bold w-full transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl max-w-3xl font-space text-zinc-900">
      <div className="flex items-center gap-2 mb-8 border-b border-zinc-100 pb-4">
        <Tag className="text-brand" size={20} />
        <h3 className="text-xl font-bold tracking-tight">Gerir Categorias</h3>
      </div>

      <form
        onSubmit={handleCreateCategory}
        className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end mb-10 p-5 bg-zinc-50 rounded-2xl border border-zinc-100"
      >
        <div className="flex-1">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Nome da Categoria
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Frontend, Backend..."
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm transition-colors"
          />
        </div>
        <div className="sm:w-auto relative">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Cor da Etiqueta
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-11 rounded-lg border border-zinc-200 shadow-inner flex items-center justify-center cursor-pointer relative overflow-hidden transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: color }}
            >
              <Palette
                size={18}
                className="text-white drop-shadow-sm opacity-60"
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <span className="text-sm font-mono text-zinc-500 uppercase">
              {color}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-brand text-white px-5 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand/90 transition-colors h-11 text-sm shadow-sm"
        >
          <Plus size={18} /> Adicionar
        </button>
      </form>

      <div className="space-y-4">
        <h4 className="font-semibold text-zinc-700 text-sm tracking-wide uppercase">
          As Suas Categorias ({categories.length})
        </h4>
        {categories.length === 0 ? (
          <p className="text-sm text-zinc-500 italic p-6 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
            Nenhuma categoria criada ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-xl border shadow-sm hover:shadow-md transition-all group"
                style={{
                  backgroundColor: `${cat.color}15`,
                  borderColor: `${cat.color}40`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span
                    className="text-sm font-bold tracking-tight truncate max-w-[100px]"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-1 opacity-70 hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
