// 20250622XXXXXX-fix-userid-types-and-cascade.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar tipo de userId a INTEGER y agregar FK con ON DELETE CASCADE en Comments
    await queryInterface.changeColumn('Comments', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    });
    // Cambiar tipo de userId a INTEGER y agregar FK con ON DELETE CASCADE en Posts
    await queryInterface.changeColumn('Posts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    });
    // Cambiar tipo de userId a INTEGER y agregar FK con ON DELETE CASCADE en Likes
    await queryInterface.changeColumn('Likes', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    });
    // Cambiar tipo de userId a INTEGER y agregar FK con ON DELETE CASCADE en Reports
    await queryInterface.changeColumn('Reports', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    // Revertir a STRING sin FK ni CASCADE
    await queryInterface.changeColumn('Comments', 'userId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Posts', 'userId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Likes', 'userId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Reports', 'userId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
