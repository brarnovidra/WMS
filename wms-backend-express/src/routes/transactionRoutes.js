import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { paginationMiddleware } from "../utils/pagination.js";
import { redisCache } from '../middleware/cache.js'
import { getTransactions, getTransactionById, createTransaction, deleteTransaction} from '../controllers/transactionController.js';

const router = express.Router();

// Middleware: generate key berdasarkan query params + user
const generateCacheKey = (req) => {
  const userId = req.user?.id || 'anon'
  const { page = 1, limit = 10, search = '', filterBy = '', filterValue = '' , sortBy = '', sortOrder = '' } = req.query

  return `contents:user:${userId}:page=${page}:limit=${limit}:search=${search}:filterBy=${filterBy}:filterValue=${filterValue}:sortBy=${sortBy}:sortOrder=${sortOrder}`
}

// router.get('/', authenticate, paginationMiddleware, getContent);
// router.get('/users', authenticate, redisCache(generateCacheKey, 300), paginationMiddleware, getUserContents);

router.get('/', authenticate, authorizeRoles('Admin', 'User'), paginationMiddleware, getTransactions);
router.get('/:id', authenticate, authorizeRoles('Admin', 'User'), getTransactionById);
router.post('/', authenticate, authorizeRoles('Admin','User'), createTransaction);
router.delete("/:id", authenticate, authorizeRoles('Admin'), deleteTransaction);

export default router;
