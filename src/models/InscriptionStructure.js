// models/InscriptionStructure.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

// Modelo para almacenar la estructura de inscripción
const InscriptionStructure = sequelize.define('InscriptionStructure', {
  table_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  field_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  field_type: {
    type: DataTypes.STRING, // Tipo de dato: VARCHAR, INTEGER, DATE, etc.
    allowNull: false,
  },
}, {
  tableName: 'inscription_structure',
  freezeTableName: true, // Desactivar la pluralización automática de Sequelize
});

module.exports = InscriptionStructure;

