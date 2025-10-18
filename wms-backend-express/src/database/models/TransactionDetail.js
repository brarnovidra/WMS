import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class TransactionDetail  extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: 'transaction_id',
        as: 'transaction',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      TransactionDetail.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  TransactionDetail .init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: 'TransactionDetail',
      tableName: 'transaction_details',
      timestamps: true,
    }
  );

  return TransactionDetail ;
};
