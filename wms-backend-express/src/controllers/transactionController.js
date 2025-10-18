import { sequelize, Transaction, TransactionDetail, Item, User } from "../database/models/index.js";
import { success, error } from "../utils/response.js";
import { buildPagination } from "../utils/pagination.js";
import { Op } from "sequelize";

export const generateReferenceNumber = async (type) => {
    const year = new Date().getFullYear();
    const t = await sequelize.transaction();

    // Ambil transaksi terakhir berdasarkan tipe dan tahun
    const lastTransaction = await Transaction.findOne({
        where: {
            type,
            reference_number: {
                [Op.like]: `${type}-${year}-%`
            }
        },
        order: [["createdAt", "DESC"]],
        lock: t.LOCK.UPDATE, 
        transaction: t
    });

    // Ambil nomor urut terakhir
    let nextNumber = 1;
    if (lastTransaction) {
        const parts = lastTransaction.reference_number.split("-");
        const lastNumber = parseInt(parts[2]);
        nextNumber = lastNumber + 1;
    }

    // Format nomor urut jadi 4 digit (0001, 0002, dst)
    const padded = String(nextNumber).padStart(8, "0");
    await t.commit();
    return `${type}-${year}-${padded}`;
};

export const createTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { type, notes, details } = req.body;

        const user_id = req.user.id;

        if (!user_id) {
            await t.rollback();
            return error(res, 'User authentication required', 401);
        }


        if (!type || !Array.isArray(details) || details.length === 0) {
            await t.rollback();
            return error(res, "Missing required fields or empty details array", 400);
        }

        if (!["IN", "OUT"].includes(type)) {
            await t.rollback();
            return error(res, "Invalid transaction type. Must be IN or OUT", 400);
        }

        const reference_number = await generateReferenceNumber(type);

        // Create main transaction
        const transaction = await Transaction.create(
            { type, reference_number, user_id, notes },
            { transaction: t }
        );

        for (const detail of details) {
            const { item_id, quantity } = detail;

            if (!item_id || !quantity || quantity <= 0) {
                await t.rollback();
                return error(res, "Invalid item_id or quantity in details", 400);
            }

            const item = await Item.findByPk(item_id, { transaction: t });
            if (!item) {
                await t.rollback();
                return error(res, `Item with ID ${item_id} not found`, 404);
            }

            // Update stock based on type
            if (type === "IN") {
                item.stock += quantity;
            } else if (type === "OUT") {
                if (item.stock < quantity) {
                    await t.rollback();
                    return error(
                        res,
                        `Insufficient stock for item '${item.name}' (Available: ${item.stock}, Requested: ${quantity})`,
                        400
                    );
                }
                item.stock -= quantity;
            }

            await item.save({ transaction: t });

            // Create detail record
            await TransactionDetail.create(
                {
                    transaction_id: transaction.id,
                    item_id,
                    quantity,
                },
                { transaction: t }
            );
        }

        await t.commit();
        return success(res, "Transaction created successfully", transaction);
    } catch (err) {
        await t.rollback();
        console.error("Error creating transaction:", err);
        return error(res, err.message, 500);
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { page, limit, offset, search, filterBy, filterValue, sortBy = "id", sortOrder = "DESC" } = req.pagination;

        const where = {};

        if (search) {
            where[Op.or] = [
                { reference_number: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter by role
        if (filterBy && filterValue) {
            where[filterBy] = filterValue;
        }

        const { count, rows } = await Transaction.findAndCountAll({
            where,
            include: [
                { model: User, as: "user", attributes: ["id", "name", "username"] },
                {
                    model: TransactionDetail,
                    as: "details",
                    include: [{ model: Item, as: "item", attributes: ["id", "name", "sku", "stock"] }],
                },
            ],
            order: [[sortBy, sortOrder.toUpperCase()]],
            offset,
            limit,
        });

        return success(res, "Transactions retrieved", {
            transactions: rows,
            pagination: buildPagination(count, { page, limit }),
        });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return error(res, err.message, 500);
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id, {
            include: [
                { model: User, as: "user", attributes: ["id", "name", "username"] },
                {
                    model: TransactionDetail,
                    as: "details",
                    include: [{ model: Item, as: "item", attributes: ["id", "name", "sku", "rack_location"] }],
                },
            ],
        });

        if (!transaction) return error(res, "Transaction not found", 404);
        return success(res, "Transaction retrieved", transaction);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

export const deleteTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByPk(id, {
            include: [{ model: TransactionDetail, as: "details" }],
            transaction: t,
        });

        if (!transaction) {
            await t.rollback();
            return error(res, "Transaction not found", 404);
        }

        // Rollback stock changes
        for (const detail of transaction.details) {
            const item = await Item.findByPk(detail.item_id, { transaction: t });
            if (!item) continue;

            if (transaction.type === "IN") {
                item.stock -= detail.quantity;
                if (item.stock < 0) item.stock = 0;
            } else if (transaction.type === "OUT") {
                item.stock += detail.quantity;
            }

            await item.save({ transaction: t });
        }

        await TransactionDetail.destroy({ where: { transaction_id: id }, transaction: t });
        await transaction.destroy({ transaction: t });

        await t.commit();
        return success(res, "Transaction deleted and stock adjusted");
    } catch (err) {
        await t.rollback();
        console.error("Error deleting transaction:", err);
        return error(res, err.message, 500);
    }
};
