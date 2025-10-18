import { Item } from "../database/models/index.js";
import { success, error } from "../utils/response.js";
import { buildPagination } from "../utils/pagination.js";
import { Op } from "sequelize";

export const getItems = async (req, res) => {
  try {
    const { page, limit, offset, search, filterBy, filterValue, sortBy = "id", sortOrder = "ASC" } = req.pagination;

    const where = {};

    // Search by name or sku
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { rack_location: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter 
    if (filterBy && filterValue) {
      where[filterBy] = filterValue;
    }

    const { count, rows } = await Item.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });
    
    return success(res, "Items retrieved", {
      items: rows,
      pagination: buildPagination(count, { page, limit }),
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    return error(res, err.message, 500);
  }
};

export const getItemById = async (req, res) => {
  try {
    const Items = await Item.findByPk(req.params.id);
    if (!Items) return error(res, "Item not found", 404);
    return success(res, "Item retrieved", Items);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, sku, stock, rack_location } = req.body;

    const errors = validateItemInput({ name, sku, stock, rack_location });
    if (errors.length) return error(res, errors.join(" "), 400);

    const existingItem = await Item.findOne({ where: { sku } });
    if (existingItem) return error(res, "SKU already exists", 409);

    const item = await Item.create({ name, sku, stock, rack_location });
    return success(res, "Item created", item);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateItem = async (req, res) => {
  try {
    const { name, sku, stock, rack_location } = req.body;

    const item = await Item.findByPk(req.params.id);
    if (!item) return error(res, "Item not found", 404);

    if (sku && sku !== item.sku) {
      const existingItem = await Item.findOne({ where: { sku } });
      if (existingItem) return error(res, "SKU already exists", 409);
    }

    await item.update({
      name: name ?? item.name,
      sku: sku ?? item.sku,
      stock: stock ?? item.stock,
      rack_location: rack_location ?? item.rack_location,
    });

    return success(res, "Item updated", item);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteItem = async (req, res) => {
  try {
    const Items = await Item.findByPk(req.params.id);
    if (!Items) return error(res, "Item not found", 404);

    await Items.destroy();
    return success(res, "Item deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const validateItemInput = ({ name, sku, stock, rack_location }) => {
  const errors = [];

  if (!name || name.trim() === "") errors.push("Name is required.");
  if (!sku || sku.trim() === "") errors.push("SKU is required.");
  if (stock != null && isNaN(Number(stock))) errors.push("Stock must be a number.");
  if (!rack_location || rack_location.trim() === "") errors.push("Rack location is required.");

  return errors;
};
