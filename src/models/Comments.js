// src/models/Comments.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const User = require('./User'); // Importar el modelo User

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  table_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre de la tabla a la que pertenece el comentario',
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del registro al que se le está dejando el comentario',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del usuario que crea el comentario',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenido del comentario',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    comment: 'Fecha y hora de creación del comentario',
  },
}, {
  timestamps: false,
  tableName: 'comments',
});

// Definir asociaciones
Comment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Comment;
