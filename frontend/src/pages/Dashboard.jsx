import { AnchorHome } from "../components/AnchorHome.jsx";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 font-space">
      <AnchorHome />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-zinc-800">Suas Tarefas</h1>
      </main>
    </div>
  );
}
