import { CategoryService } from "../services/categoryService.js";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req, res) {
    const email = req.headers["user-email"];
    const { name, color } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required!" });
    }

    try {
      await categoryService.createNewCategory(name, color, email);
      return res
        .status(201)
        .json({ message: "Category created successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const email = req.headers["user-email"];

    if (!email) {
      return res
        .status(400)
        .json({ error: "User email is required to list categories." });
    }

    try {
      const categories = await categoryService.getCategories(email);
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const email = req.headers["user-email"];
    const categoryId = req.params.id;

    if (!email || !categoryId) {
      return res
        .status(400)
        .json({ error: "Missing user email or category ID." });
    }

    try {
      await categoryService.deleteCategory(categoryId, email);
      return res.status(200).json({ message: "Category deleted." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
