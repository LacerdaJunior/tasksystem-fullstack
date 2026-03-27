import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class ProgressService {
  async getProgressReport(userId) {
    const tasks = await database.getTasksByUser(userId);
    const allSubtasks = await database.getAllSubtasksByUser(userId);

    const relatorio = tasks.map((task) => {
      const taskChecklist = allSubtasks.filter((subtask) => {
        return subtask.task_id === task.id;
      });

      const totalSubtasks = taskChecklist.length;

      const concluidas = taskChecklist.filter((subtask) => {
        return subtask.is_completed === true;
      }).length;

      let porcentagem = 0;
      if (totalSubtasks > 0) {
        porcentagem = (concluidas / totalSubtasks) * 100;
      }

      let aviso = null;
      if (porcentagem === 100 && task.status !== "DONE") {
        aviso =
          "Atenção: Checklist 100% concluído! Não esqueça de mover a tarefa para DONE.";
      }

      return {
        taskId: task.id,
        title: task.title,
        status: task.status,
        totalChecklist: totalSubtasks,
        completed: concluidas,
        progress: Math.round(porcentagem),
        warning: aviso,
      };
    });

    return relatorio;
  }
}
