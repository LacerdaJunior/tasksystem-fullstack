import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class MetricsService {
  async getDashboardMetrics(userId) {
    const rawMetrics = await database.getMetrics(userId);

    const formattedMetrics = {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
    };

    rawMetrics.forEach((row) => {
      const count = Number(row.count);

      formattedMetrics.totalTasks += count;

      switch (row.status) {
        case "TODO":
          formattedMetrics.todoTasks = count;
          break;
        case "IN_PROGRESS":
          formattedMetrics.inProgressTasks = count;
          break;
        case "DONE":
          formattedMetrics.doneTasks = count;
          break;
      }
    });
    return formattedMetrics;
  }
}
