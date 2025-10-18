import { Role } from "../database/models/index.js";
import { success, error } from "../utils/response.js";

export const getRoles = async (req, res) => {
  try {
    const Roles = await Role.findAll();
    return success(res, "Roles retrieved", Roles);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getRoleById = async (req, res) => {
  try {
    const Roles = await Role.findByPk(req.params.id);
    if (!Roles) return error(res, "Role not found", 404);
    return success(res, "Role retrieved", Roles);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const Roles = await Role.create({ name });
    return success(res, "Role created", Roles);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const Roles = await Role.findByPk(req.params.id);
    if (!Roles) return error(res, "Role not found", 404);

    Roles.name = name || Role.name;
    await Roles.save();

    return success(res, "Role updated", Roles);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteRole = async (req, res) => {
  try {
    const Roles = await Role.findByPk(req.params.id);
    if (!Roles) return error(res, "Role not found", 404);

    await Roles.destroy();
    return success(res, "Role deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
