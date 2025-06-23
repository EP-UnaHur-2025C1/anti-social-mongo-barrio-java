module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Paso 1: Agrega la columna permitiendo nulos
    await queryInterface.addColumn('Users', 'nickName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Paso 2: Actualiza los nickName de los usuarios existentes con valores únicos temporales
    const [users] = await queryInterface.sequelize.query('SELECT id FROM Users');
    for (const user of users) {
      await queryInterface.sequelize.query(
        `UPDATE Users SET nickName = 'user_' || id WHERE id = ${user.id}`
      );
    }

    // Paso 3: Cambia la columna a NOT NULL y UNIQUE
    await queryInterface.changeColumn('Users', 'nickName', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'nickName');
  }
};