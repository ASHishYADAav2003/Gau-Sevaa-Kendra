import { asyncHandler } from "../utils/async-handler.js";
import { getDashboardMetrics } from "../services/dashboard.service.js";

export const adminDashboard = asyncHandler(async (req, res) => {
  const result = await getDashboardMetrics();
  res.status(200).json(result);
});
