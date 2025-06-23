'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Esta migración está deshabilitada porque la columna 'email' ya existe.
    // await queryInterface.addColumn('Users', 'email', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Users', 'email');
  }
};
