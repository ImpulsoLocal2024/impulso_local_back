// server.js

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/utils/sequelize');
const userRoutes = require('./src/routes/userRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const inscriptionRoutes = require('./src/routes/inscriptionRoutes'); // Importar las rutas de inscripción
const path = require('path');
require('dotenv').config();
require('./src/models/associations'); // Cargar las asociaciones entre modelos

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (si es necesario)
app.use('/uploads', express.static('/var/data/uploads'));


// Importar y definir el modelo FieldPreference
const FieldPreference = require('./src/models/FieldPreference')(sequelize, require('sequelize').DataTypes);

// Rutas de usuarios
app.use('/api/users', userRoutes);
// Rutas de roles
app.use('/api/roles', roleRoutes);
// Rutas de permisos
app.use('/api/permissions', permissionRoutes);
// Conectar las rutas de asignación de permisos a roles
app.use('/api/role-permissions', rolePermissionRoutes);
// Rutas de inscripción
app.use('/api/inscriptions', inscriptionRoutes); 

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API Impulso Capital funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    // Sincronizar modelos solo en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Base de datos sincronizada y tablas ajustadas (solo en desarrollo)');
    } else {
      console.log('Sincronización automática deshabilitada en producción');
    }
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
  }
});



