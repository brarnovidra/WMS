export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('items', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(100), allowNull: false },
    sku: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    rack_location: { type: Sequelize.STRING(50), allowNull: true },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('items');
}