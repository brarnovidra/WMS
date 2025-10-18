export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('refresh_tokens', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: Sequelize.INTEGER, allowNull: false },
    token: { type: Sequelize.STRING, allowNull: false },
    expires_at: { type: Sequelize.DATE, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('refresh_tokens');
}