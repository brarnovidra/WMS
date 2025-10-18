import bcryptjs from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  const existingUsers = await queryInterface.sequelize.query(
    `
    SELECT username FROM users WHERE username IN (:usernames)
    `,
    {
      replacements: { usernames: ['admin', 'user'] },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  const existingUsernames = existingUsers.map(user => user.username);
  const usersToInsert = [];

  if (!existingUsernames.includes('admin')) {
    const hashedAdminPassword = await bcryptjs.hash('admin', 10);
    usersToInsert.push({
      name: 'Administrator',
      username: 'admin',
      password: hashedAdminPassword,
      role_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (!existingUsernames.includes('user')) {
    const hashedUserPassword = await bcryptjs.hash('user', 10);
    usersToInsert.push({
      name: 'User',
      username: 'user',
      password: hashedUserPassword,
      role_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (usersToInsert.length > 0) {
    await queryInterface.bulkInsert('users', usersToInsert);
    console.log(`✅ ${usersToInsert.length} user(s) berhasil ditambahkan.`);
  } else {
    console.log('ℹ️ User admin dan user sudah ada. Skip seeding.');
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', {
    username: ['admin', 'user'],
  });

  console.log('User admin dan user berhasil dihapus.');
}
