import { MetricsService } from "../services/metricsService.js";

const metricsService = new MetricsService();

export class MetricsController {
  async index(req, res) {
    const userId = req.userId;

    try {
      const metrics = await metricsService.getDashboardMetrics(userId);
      return res.status(200).json(metrics);
    } catch (error) {
      console.error("Erro no MetricsController:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao carregar métricas." });
    }
  }
}
