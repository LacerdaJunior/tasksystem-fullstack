import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class CategoryService {
  async createNewCategory(name, color, user_email) {
    const user = await database.findByEmail(user_email);

    if (!user) {
      throw new Error("User not found for this category.");
    }

    await database.createCategory(name, color, user_email);
  }
}
