import { CategoryService } from "../services/categoryService.js";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req, res) {
    const { name, color, email } = req.body;

    if (!name || !email) {
      return res.status(400).send("All data must be filled!");
    }

    try {
      await categoryService.createNewCategory(name, color, email);
      return res.status(201).send("Category created successfully");
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
