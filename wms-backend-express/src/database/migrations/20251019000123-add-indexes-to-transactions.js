export async function up(queryInterface, Sequelize) {
    // Index untuk mempercepat filter dan grouping di dashboard statistik
    await queryInterface.addIndex('transactions', ['createdAt'], {
        name: 'idx_transactions_createdAt'
    });

    await queryInterface.addIndex('transactions', ['type'], {
        name: 'idx_transactions_type'
    });

    await queryInterface.addIndex('transaction_details', ['transaction_id'], {
        name: 'idx_transaction_details_transaction_id'
    });
}
export async function down(queryInterface, Sequelize) {
    // Rollback jika perlu dihapus
    await queryInterface.removeIndex('transactions', 'idx_transactions_createdAt');
    await queryInterface.removeIndex('transactions', 'idx_transactions_type');
    await queryInterface.removeIndex('transaction_details', 'idx_transaction_details_transaction_id');
}