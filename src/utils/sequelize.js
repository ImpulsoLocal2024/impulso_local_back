const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Esto es útil si el certificado SSL es autofirmado o no está verificado
    },
  },
});

// Verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a PostgreSQL mediante Sequelize');
  })
  .catch((err) => {
    console.error('Error conectando a la base de datos:', err);
  });

module.exports = sequelize;
