import { randomUUID } from "node:crypto";
import sql from "../config/db.js";

export class DatabasePostg {
  async findByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;

    return result[0];
  }
  async create(user) {
    const userId = randomUUID();

    const { name, email, password } = user;

    await sql`insert into users  (id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${password})`;
  }

  async updateAvatar(email, avatar_url) {
    try {
      await sql`UPDATE users SET avatar_url = ${avatar_url} WHERE email= ${email} `;
    } catch (error) {
      console.error("Erro no update do banco:", error);
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      await sql`
        UPDATE users 
        SET password = ${newPassword} 
        WHERE email = ${email}
      `;

      return true;
    } catch (error) {
      console.error("Erro ao atualizar senha no banco:", error);
      throw new Error("Erro interno ao atualizar a senha no banco de dados.");
    }
  }

  async deleteUser(email) {
    try {
      await sql`
      DELETE FROM users WHERE email = ${email}
      `;
      return true;
    } catch (error) {
      console.log("Erro ao excluir conta no banco:", error);
      throw new Error("Erro interno ao confirmar exclusão de conta");
    }
  }
}
