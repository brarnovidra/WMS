import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { paginationMiddleware } from "../utils/pagination.js";
import { getItems, getItemById, createItem, updateItem, deleteItem} from '../controllers/itemController.js';
const router = express.Router();

router.get("/", authenticate, authorizeRoles('Admin', 'User'), paginationMiddleware, getItems);
router.get("/:id", authenticate, authorizeRoles('Admin', 'User'), getItemById);
router.post("/", authenticate, authorizeRoles('Admin'), createItem);
router.put("/:id", authenticate, authorizeRoles('Admin'), updateItem);
router.delete("/:id", authenticate, authorizeRoles('Admin',),deleteItem);

export default router;
