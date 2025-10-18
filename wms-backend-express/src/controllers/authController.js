import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, Role, RefreshToken } from '../database/models/index.js';
import { success, error } from '../utils/response.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Generate Refresh Token (stored in DB)
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await RefreshToken.create({
    user_id: userId,
    token,
    expires_at: expires
  });

  return token;
};

export const register = async (req, res) => {
  try {
    const { name, username, password, role_id } = req.body;

    if (!username || !password) {
      return error(res, 'Username and password are required', 400);
    }

    if (!role_id) {
      return error(res, 'Role is required', 400);
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return error(res, 'Username already taken', 400);
    }

    // Check if role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return error(res, 'Invalid role', 400);
    }

    // Hash the password
    const hashed = await bcryptjs.hash(password, 10);

    // Create the new user
    const user = await User.create({
      name,
      username,
      password: hashed,
      role_id,
    });

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return success(res, 'Registration successful', {
      accessToken,
      refreshToken,
      user,
    });

  } catch (err) {
    return error(res, err.message, 500);
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 'Username and password are required', 400);
    }

    // hanya cari user dengan provider local
    const user = await User.findOne({ where: { username }, include: [{ model: Role, as: 'role' }] });
    if (!user) return error(res, 'User not found or not registered locally', 404);

    // validasi password
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return error(res, 'Invalid credentials', 401);

    // generate token
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return success(res, 'Login successful', { accessToken, refreshToken, user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored) return error(res, 'Invalid refresh token', 401);

    if (new Date(stored.expires_at) < new Date()) {
      return error(res, 'Refresh token expired', 401);
    }

    const user = await User.findByPk(stored.user_id, {
      include: [{ model: Role, as: 'role' }]
    })

    if (!user) return error(res, 'User not found', 404);

    const accessToken = generateToken(user);
    return success(res, 'Token refreshed', { accessToken, user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Logout (delete refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    await RefreshToken.destroy({ where: { token: refreshToken } });
    return success(res, 'Logout successful', null);
  } catch (err) {
    return error(res, err.message, 500);
  }
};