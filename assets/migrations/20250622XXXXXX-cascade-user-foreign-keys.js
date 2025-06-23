'use strict';

/**
 * Este script ajusta las claves foráneas para que tengan ON DELETE CASCADE en todas las relaciones de usuario.
 * Asegúrate de hacer backup si tienes datos importantes.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Posts
    await queryInterface.removeConstraint('Posts', 'Posts_userId_fkey').catch(()=>{});
    await queryInterface.addConstraint('Posts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Posts_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Comments
    await queryInterface.removeConstraint('Comments', 'Comments_userId_fkey').catch(()=>{});
    await queryInterface.addConstraint('Comments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Comments_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Likes
    await queryInterface.removeConstraint('Likes', 'Likes_userId_fkey').catch(()=>{});
    await queryInterface.addConstraint('Likes', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Likes_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Reports
    await queryInterface.removeConstraint('Reports', 'Reports_userId_fkey').catch(()=>{});
    await queryInterface.addConstraint('Reports', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Reports_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // UserFollow (seguidores/seguidos)
    await queryInterface.removeConstraint('UserFollows', 'UserFollows_followerId_fkey').catch(()=>{});
    await queryInterface.removeConstraint('UserFollows', 'UserFollows_followedId_fkey').catch(()=>{});
    await queryInterface.addConstraint('UserFollows', {
      fields: ['followerId'],
      type: 'foreign key',
      name: 'UserFollows_followerId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('UserFollows', {
      fields: ['followedId'],
      type: 'foreign key',
      name: 'UserFollows_followedId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // No se recomienda revertir, pero podrías restaurar las restricciones sin CASCADE si lo necesitas
  }
};
