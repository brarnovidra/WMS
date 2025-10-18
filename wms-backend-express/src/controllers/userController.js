import { Op } from "sequelize";
import { User, Role } from "../database/models/index.js";
import { success, error } from "../utils/response.js";
import { buildPagination } from "../utils/pagination.js";
import bcryptjs from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const { page, limit, offset, search, filterBy, filterValue, sortBy = "id", sortOrder = "ASC" } = req.pagination;

    const where = {};

    // Search by name or username
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by role
    if (filterBy && filterValue) {
      where[filterBy] = filterValue;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      attributes: { exclude: ["password"] },
      offset,
      limit,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });
    
    return success(res, "Users retrieved", {
      users: rows,
      pagination: buildPagination(count, { page, limit }),
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return error(res, err.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      attributes: { exclude: ["password"] },
    });

    if (!user) return error(res, "User not found", 404);
    return success(res, "User retrieved", user);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, username, password, role_id } = req.body;

    if (!name || !username || !password || !role_id)
      return error(res, "Missing required fields", 400);

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return error(res, "Username already exists", 409);

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      role_id,
    });

    return success(res, "User created", {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      role_id: newUser.role_id,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, role_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) return error(res, "User not found", 404);

    if (username) {
      const existing = await User.findOne({ where: { username } });
      if (existing && existing.id !== parseInt(id))
        return error(res, "Username already taken", 409);
    }

    let hashedPassword = user.password;
    if (password) hashedPassword = await bcryptjs.hash(password, 10);

    await user.update({
      name: name ?? user.name,
      username: username ?? user.username,
      password: hashedPassword,
      role_id: role_id ?? user.role_id,
    });

    // Re-fetch the updated user with associated Role
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role, as: 'role',
          attributes: ['id', 'name'],
        },
      ],
    });

    return success(res, "User updated", updatedUser);


  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, "User not found", 404);

    await user.destroy();
    return success(res, "User deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
