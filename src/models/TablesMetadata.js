// models/TablesMetadata.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const TablesMetadata = sequelize.define('TablesMetadata', {
    table_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false,
});

module.exports = TablesMetadata;
