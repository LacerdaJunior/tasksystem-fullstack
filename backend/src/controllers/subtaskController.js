import { SubtaskService } from "../services/subtaskService.js";

const subtaskService = new SubtaskService();

export class SubtaskController {
  async create(req, res) {
    const taskId = req.params.taskId;

    const { title } = req.body;

    if (!taskId || !title) {
      return res.status(400).json({ error: "All data must be filled." });
    }

    try {
      await subtaskService.createNewSubtask(taskId, title);
      return res.status(201).json({ message: "subtask created successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const taskId = req.params.taskId;

    try {
      const subtasks = await subtaskService.getSubtasks(taskId);
      return res.status(200).json(subtasks);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async toggle(req, res) {
    const id = req.params.id;

    try {
      await subtaskService.toggleStatus(id);
      return res.status(200).json({ message: "subtask updated successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      await subtaskService.deleteSubtask(id);
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
