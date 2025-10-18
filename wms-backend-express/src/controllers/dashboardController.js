import { Op, fn, col, literal } from "sequelize";
import { Item, Transaction, TransactionDetail, sequelize } from "../database/models/index.js";
import { success, error } from "../utils/response.js";


export const getDashboardSummary = async (req, res) => {
    try {
        const totalIn = await TransactionDetail.sum("quantity", {
            where: {
                "$transaction.type$": "IN"
            },
            include: [{
                model: Transaction,
                as: "transaction",
                attributes: []
            }],
            raw: true
        });

        const totalOut = await TransactionDetail.sum("quantity", {
            where: {
                "$transaction.type$": "OUT"
            },
            include: [{
                model: Transaction,
                as: "transaction",
                attributes: []
            }],
            raw: true
        });

        const totalItems = await Item.count();

        return success(res, "Dashboard summary retrieved", {
            totalItems,
            totalIn: totalIn || 0,
            totalOut: totalOut || 0
        });
    } catch (err) {
        console.error("Dashboard Summary Error:", err);
        return error(res, err.message, 500);
    }
};


export const getDashboardStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Default 14 hari terakhir
        const start = startDate
            ? new Date(startDate)
            : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // Ambil data transaksi + join detail
        const transactions = await Transaction.findAll({
            attributes: [
                [fn("DATE", col("Transaction.createdAt")), "date"],
                "type",
                [fn("COUNT", col("Transaction.id")), "transactionCount"],
                [fn("SUM", col("details.quantity")), "totalQuantity"]
            ],
            include: [
                {
                    model: TransactionDetail,
                    as: "details",
                    attributes: [],
                },
            ],
            where: {
                createdAt: { [Op.between]: [start, end] },
            },
            group: [fn("DATE", col("Transaction.createdAt")), "Transaction.type"],
            order: [[fn("DATE", col("Transaction.createdAt")), "ASC"]],
            raw: true,
        });

        // Format hasil ke bentuk { date, totalIn, totalOut, totalItemsIn, totalItemsOut }
        const formatted = {};

        transactions.forEach((row) => {
            const date = row.date;
            const type = row.type;
            const transactionCount = Number(row.transactionCount) || 0;
            const totalQty = Number(row.totalQuantity) || 0;

            if (!formatted[date]) {
                formatted[date] = {
                    date,
                    totalIn: 0,
                    totalOut: 0,
                    totalItemsIn: 0,
                    totalItemsOut: 0,
                };
            }

            if (type === "IN") {
                formatted[date].totalIn += transactionCount;
                formatted[date].totalItemsIn += totalQty;
            } else if (type === "OUT") {
                formatted[date].totalOut += transactionCount;
                formatted[date].totalItemsOut += totalQty;
            }
        });

        const result = Object.values(formatted);

        return success(res, "Dashboard statistics retrieved", {
            dailyStats: result,
        });
    } catch (err) {
        console.error("Dashboard Statistics Error:", err);
        return error(res, err.message, 500);
    }
};
