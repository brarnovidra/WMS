import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: 'transaction_id',
        as: 'details',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false,
        comment: 'IN = incoming stock, OUT = outgoing stock',
      },
      reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
    }
  );

  return Transaction;
};
