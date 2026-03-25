import { ProgressService } from "../services/progressService.js";

const progressService = new ProgressService();

export class ProgressController {
  async index(req, res) {
    const userId = req.userId;

    try {
      const progress = await progressService.getProgressReport(userId);
      return res.status(200).json(progress);
    } catch (error) {
      console.error("Erro no ProgressController:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao carregar progresso de usuário." });
    }
  }
}
