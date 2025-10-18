export async function up(queryInterface, Sequelize) {
  // Mengecek apakah sudah ada data roles dengan nama Admin atau User
  const [existing] = await queryInterface.sequelize.query(
    `
    SELECT COUNT(*) AS count
    FROM roles
    WHERE name IN (:names)
    `,
    {
      replacements: { names: ['Admin', 'User'] },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  if (parseInt(existing.count) > 0) {
    console.log('✅ Role Admin/User sudah ada. Skip seeding.');
    return;
  }

  // Insert jika belum ada
  await queryInterface.bulkInsert('roles', [
    {
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('✅ Role Admin dan User berhasil ditambahkan.');
}

export async function down(queryInterface, Sequelize) {
  // Menghapus hanya role Admin dan User
  await queryInterface.bulkDelete('roles', {
    name: ['Admin', 'User'],
  });

  console.log('Role Admin dan User berhasil dihapus.');
}
