import { Sequelize } from 'sequelize';
import dbConfig from '../../config/db.js';

import RoleModel from './Role.js';
import UserModel from './User.js';
import ItemModel from './Item.js';
import TransactionModel from './Transaction.js';
import TransactionDetailModel from './TransactionDetail.js';
import RefreshTokenModel from './RefreshToken.js';

// Ambil config sesuai environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Buat instance Sequelize langsung dari config
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Definisikan model dengan sequelize instance
const models = {
  Role: RoleModel(sequelize),
  User: UserModel(sequelize),
  Item: ItemModel(sequelize),
  Transaction: TransactionModel(sequelize),
  TransactionDetail: TransactionDetailModel(sequelize),
  RefreshToken: RefreshTokenModel(sequelize),
};

// Setup associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Export
export const { Role, User, Item, Transaction, TransactionDetail, RefreshToken } = models;
export { sequelize };
export default models;
