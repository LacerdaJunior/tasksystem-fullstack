import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { NewTaskModal } from "./NewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { CategoriesManager } from "./CategoriesManager";
import toast, { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Edit2,
  UserPlus,
  GripVertical,
  Pin,
  Tag,
  ChevronDown, 
  ChevronRight, 
} from "lucide-react";

const formatarData = (dataString) => {
  if (!dataString) return "Sem data";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const TaskCard = ({ task, onEdit, dragHandleProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async () => {
    setIsMenuOpen(false);
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[200px] font-space">
          <span className="font-semibold text-sm text-zinc-800 text-center">
            Excluir permanentemente?
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Excluindo...");
                try {
                  const userString = localStorage.getItem("@LoginOne:user");
                  const user = JSON.parse(userString);
                  await api.delete(`/dashboard/tasks/${task.id}`, {
                    headers: { "user-email": user.email },
                  });
                  toast.success("Tarefa excluída!", { id: loadingToast });
                  setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                  toast.error("Erro ao excluir a tarefa.", {
                    id: loadingToast,
                  });
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
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group relative font-space">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="text-zinc-400 hover:text-brand cursor-grab active:cursor-grabbing touch-none p-1 -ml-2 rounded"
          >
            <GripVertical size={16} />
          </div>
          {task.category ? (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${task.category.color}20`,
                color: task.category.color,
              }}
            >
              {task.category.name}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-500">
              Sem categoria
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-zinc-300 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors"
        >
          <MoreVertical size={16} />
        </button>
        {isMenuOpen && (
          <div className="absolute top-10 right-4 w-40 bg-white border border-zinc-200 rounded-lg shadow-xl z-10 overflow-hidden flex flex-col">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(task);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left"
            >
              <Edit2 size={14} /> Editar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-brand hover:bg-zinc-50 text-left border-b border-zinc-100">
              <UserPlus size={14} /> Convidar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-zinc-800 text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-zinc-500 line-clamp-2">
          {task.description || "Sem descrição..."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-50">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            task.status === "DONE" ? "text-green-500" : "text-zinc-400"
          }`}
        >
          {task.status === "DONE" ? (
            <CheckCircle2 size={14} />
          ) : (
            <Calendar size={14} />
          )}
          <span>{formatarData(task.due_date)}</span>
        </div>
        <div className="flex -space-x-2">
          <div
            className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm"
            title="Você"
          >
            VC
          </div>
        </div>
      </div>
    </div>
  );
};

export function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

 
  const [collapsed, setCollapsed] = useState({
    TODO: false,
    IN_PROGRESS: false,
    DONE: false,
  });

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userString = localStorage.getItem("@LoginOne:user");
      if (!userString) return navigate("/login");
      const user = JSON.parse(userString);

      try {
        const [tasksRes, catRes] = await Promise.all([
          api.get("/dashboard/tasks", {
            headers: { "user-email": user.email },
          }),
          api.get("/dashboard/categories", {
            headers: { "user-email": user.email },
          }),
        ]);

        setTasks(tasksRes.data);
        setCategories(catRes.data);
      } catch (error) {
        toast.error("Erro ao carregar os dados do painel.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const userString = localStorage.getItem("@LoginOne:user");
      const user = JSON.parse(userString);
      await api.patch(
        `/dashboard/tasks/${draggableId}`,
        { status: newStatus },
        { headers: { "user-email": user.email } }
      );
    } catch (error) {
      toast.error("Erro ao salvar a posição.");
      window.location.reload();
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesCategory =
        selectedFilter === "ALL" ||
        (task.category && task.category.id === selectedFilter);
      return matchesStatus && matchesCategory;
    });
  };

 
  const toggleCollapse = (status) => {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-50/50">
        <p className="text-zinc-500 font-semibold animate-pulse font-space">
          Carregando o painel...
        </p>
      </div>
    );

  return (
    <div className="w-full h-full p-4 sm:p-8 bg-zinc-50/50 relative font-space">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">
            O Meu Painel
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Gira os seus projetos e etiquetas.
          </p>
        </div>

        {activeTab === "board" && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 font-semibold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="w-full sm:w-auto justify-center bg-brand hover:bg-brand/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={18} /> Nova Tarefa
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200 mb-8 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("board")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-colors relative whitespace-nowrap ${
            activeTab === "board"
              ? "text-brand"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Pin size={16} /> Meu Quadro
          {activeTab === "board" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-colors relative whitespace-nowrap ${
            activeTab === "categories"
              ? "text-brand"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Tag size={16} /> Categorias
          {activeTab === "categories" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => toast("Sistema de rede em breve!", { icon: "👥" })}
          className="flex items-center gap-2 pb-3 text-sm font-bold text-zinc-300 cursor-not-allowed whitespace-nowrap"
        >
          <UserPlus size={16} /> Rede (Em breve)
        </button>
      </div>

      {activeTab === "categories" ? (
        <CategoriesManager />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* COLUNA: A FAZER */}
            <Droppable droppableId="TODO">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-zinc-100" : ""
                  }`}
                >
                  {/* Cabeçalho Clicável */}
                  <div
                    onClick={() => toggleCollapse("TODO")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-zinc-200/50 p-1.5 -mx-1.5 rounded-lg transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <Circle size={16} className="text-zinc-400" /> A Fazer
                      </h3>
                      {collapsed["TODO"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("TODO").length}
                    </span>
                  </div>

                  {/* Renderização Condicional das Tarefas */}
                  {!collapsed["TODO"] &&
                    getTasksByStatus("TODO").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* COLUNA: EM ANDAMENTO */}
            <Droppable droppableId="IN_PROGRESS">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleCollapse("IN_PROGRESS")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-blue-50 p-1.5 -mx-1.5 rounded-lg transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <AlertCircle size={16} className="text-blue-500" /> Em
                        Andamento
                      </h3>
                      {collapsed["IN_PROGRESS"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("IN_PROGRESS").length}
                    </span>
                  </div>

                  {!collapsed["IN_PROGRESS"] &&
                    getTasksByStatus("IN_PROGRESS").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* COLUNA: CONCLUÍDO */}
            <Droppable droppableId="DONE">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-green-50/50" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleCollapse("DONE")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-green-50 p-1.5 -mx-1.5 rounded-lg transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />{" "}
                        Concluído
                      </h3>
                      {collapsed["DONE"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("DONE").length}
                    </span>
                  </div>

                  {!collapsed["DONE"] &&
                    getTasksByStatus("DONE").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}

      <NewTaskModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onTaskCreated={() => window.location.reload()}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={() => window.location.reload()}
        task={taskToEdit}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#27272a",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            fontFamily: '"Space Grotesk", sans-serif',
          },
        }}
      />
    </div>
  );
}
