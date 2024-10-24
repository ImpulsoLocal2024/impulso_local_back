// models/File.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  table_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unknown', // Valor por defecto para los archivos que ya existan antes de la actualización.
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'files',
});

module.exports = File;

