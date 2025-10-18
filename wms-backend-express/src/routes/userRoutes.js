import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { paginationMiddleware } from "../utils/pagination.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles('Admin'), paginationMiddleware, getUsers);
router.get("/:id", authorizeRoles('Admin'), authenticate, getUserById);
router.post("/", authorizeRoles('Admin'), authenticate, createUser);
router.put("/:id", authorizeRoles('Admin'), authenticate, updateUser);
router.delete("/:id", authenticate, authorizeRoles('Admin'), deleteUser);

export default router;
