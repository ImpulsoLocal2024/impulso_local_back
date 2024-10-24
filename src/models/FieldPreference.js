module.exports = (sequelize, DataTypes) => {
    const FieldPreference = sequelize.define('FieldPreference', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      table_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      visible_columns: {
        type: DataTypes.JSON, // Usa JSONB si estás en PostgreSQL para mejor rendimiento
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'field_preferences',
      timestamps: false, // Ya hemos definido created_at y updated_at manualmente
    });
  
    return FieldPreference;
  };
  