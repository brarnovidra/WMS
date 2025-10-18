import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.TransactionDetail, {
        foreignKey: 'item_id',
        as: 'transaction_details',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

    }
  }

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      rack_location: {
        type: DataTypes.STRING(150),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'items',
      timestamps: true,
    }
  );

  return Item;
};
