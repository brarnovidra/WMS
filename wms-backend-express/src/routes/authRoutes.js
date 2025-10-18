import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Manual register & login
router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, (req, res) => {
  return res.json({
    status: 'success',
    message: 'User profile',
    data: req.user
  });
});

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
