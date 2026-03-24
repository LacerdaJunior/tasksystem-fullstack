import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class SubtaskService {
  async createNewSubtask(taskId, title) {
    await database.createSubtask(taskId, title);
  }

  async getSubtasks(taskId) {
    const subtaskList = await database.getSubtasksByTaskId(taskId);

    return subtaskList;
  }

  async toggleStatus(subtaskId) {
    await database.toggleSubtaskStatus(subtaskId);
  }

  async deleteSubtask(subtaskId) {
    await database.deleteSubtask(subtaskId);
  }
}
