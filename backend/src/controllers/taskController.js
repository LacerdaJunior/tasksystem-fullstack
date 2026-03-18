import { TaskService } from "../services/taskService.js";

const taskService = new TaskService();

export class TaskController {
  async create(req, res) {
    const { email, title, description, status, due_date, category_id } =
      req.body;

    if (!email || !title) {
      return res.status(400).json({ error: "Email and title are required!" });
    }

    try {
      await taskService.createNewTask(
        title,
        description,
        status,
        due_date,
        category_id,
        email
      );

      return res.status(201).json({ message: "Task created successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
