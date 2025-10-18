export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('transactions', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: Sequelize.ENUM('IN', 'OUT'), allowNull: false },
    reference_number: { type: Sequelize.STRING(100), allowNull: true },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    notes: { type: Sequelize.STRING(100), allowNull: true },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('transactions');
}