'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
            Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
        }

    }
    Comment.init({
        text: DataTypes.TEXT,
        userId: {
            type: DataTypes.INTEGER, // Corregido a INTEGER
            allowNull: false,
            // references: {  // Comentado para evitar problemas iniciales de sincronización, se maneja en las migraciones
            //     model: 'User', // Nombre de la tabla
            //     key: 'id'
            // }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false, // Añadido allowNull: false
            // references: {  // Comentado por la misma razón que userId
            //     model: 'Post', // Nombre de la tabla
            //     key: 'id'
            // }
        },
        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments' // Asegúrate de que esto coincida con el nombre real de tu tabla
    });
    return Comment;
};