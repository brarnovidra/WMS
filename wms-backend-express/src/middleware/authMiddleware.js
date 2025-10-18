import jwt from 'jsonwebtoken';
import { User, Role } from '../database/models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header) {
      return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
    }

    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, { 
      include: {
        model: Role,
        as: 'role'
      }
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid token user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: err.message });
  }
};
