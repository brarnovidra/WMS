import express from "express";
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles('Admin', 'User'), getRoles);
router.get("/:id", authenticate, authorizeRoles('Admin', 'User'), getRoleById);
router.post("/", authenticate, authorizeRoles('Admin'), createRole);
router.put("/:id", authenticate, authorizeRoles('Admin'), updateRole);
router.delete("/:id", authenticate, authorizeRoles('Admin'), deleteRole);

export default router;