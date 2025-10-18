export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('transaction_details', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    transaction_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'transactions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    item_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'items', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('transaction_details');
}