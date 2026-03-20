import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function EditTaskModal({ isOpen, onClose, onTaskUpdated, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCategoryId(task.category?.id || "");

      if (task.due_date) {
        const date = new Date(task.due_date);
        const formattedDate = date.toISOString().split("T")[0];
        setDueDate(formattedDate);
      } else {
        setDueDate("");
      }
    }
  }, [task]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await api.get("/dashboard/categories");
          setCategories(response.data);
        } catch (error) {
          console.error("Erro ao carregar categorias", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Salvando alterações...");

    try {
      await api.patch(`/dashboard/tasks/${task.id}`, {
        title,
        description,
        due_date: dueDate || null,
        category_id: categoryId || null,
      });

      toast.success("Tarefa atualizada!", { id: loadingToast });
      onTaskUpdated();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Erro ao atualizar a tarefa.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative font-space">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-zinc-800 mb-6">Editar Tarefa</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm bg-white"
              >
                <option value="">Nenhuma</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
