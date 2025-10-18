import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getDashboardSummary,
  getDashboardStatistics
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authenticate, authorizeRoles('Admin', 'User'), getDashboardSummary);
router.get("/statistics", authenticate, authorizeRoles('Admin', 'User'), getDashboardStatistics);

export default router;
