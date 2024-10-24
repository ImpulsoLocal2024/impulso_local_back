const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
require('dotenv').config();

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { username, email, password, role_id } = req.body;
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id,
    });

    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creando usuario',
      error: error.message,
    });
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['role_name'] }], 
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo usuarios',
      error: error.message,
    });
  }
};


// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: [Role] });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo usuario',
      error: error.message,
    });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role_id, status } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos del usuario
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.role_id = role_id || user.role_id;
    if (status !== undefined) { // Permitir actualizar el campo de status
      user.status = status;
    }

    await user.save();
    res.status(200).json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando usuario',
      error: error.message,
    });
  }
};


// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({
      message: 'Error eliminando usuario',
      error: error.message,
    });
  }
};


// Lógica de login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la encriptada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Actualizar el campo last_login con la fecha actual
    user.last_login = new Date();
    await user.save(); // Guardar la actualización en la base de datos

    // Crear el token JWT con el ID del rol
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_id,
        last_login: user.last_login, // Enviar el valor del último login en la respuesta
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error durante el login',
      error: error.message,
    });
  }
};




  const nodemailer = require('nodemailer'); // Para enviar correos

// Solicitar recuperación de contraseña (Enviar el token por correo)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear un token JWT para la recuperación (válido por 15 minutos)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Configurar el transporte de nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Podemos usar cualquier servicio de correo compatible
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar el correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Usa este enlace para restablecer tu contraseña: http://localhost:5173/reset-password/${token}`, 
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error enviando el correo', error: error.message });
      }
      res.status(200).json({ message: 'Correo enviado con éxito' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error solicitando recuperación de contraseña', error: error.message });
  }
};

// Restablecer la contraseña
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar la nueva contraseña y guardarla
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error restableciendo la contraseña', error: error.message });
  }
};

// Cambiar el estado de un usuario (activo/inactivo)
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Cambiar el estado (si está activo, lo cambia a inactivo y viceversa)
    user.status = user.status === 1 ? 0 : 1;

    await user.save();
    res.status(200).json({ message: 'Estado de usuario actualizado', status: user.status });
  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando el estado del usuario',
      error: error.message,
    });
  }
};

// Obtener usuarios con el rol de asesor
exports.getAsesors = async (req, res) => {
  try {
    console.log('Solicitud recibida para obtener asesores');

    // Buscar el rol de 'asesor' en la tabla Role
    const asesorRole = await Role.findOne({ where: { role_name: 'asesor' } });

    if (!asesorRole) {
      console.error('Rol "asesor" no encontrado en la base de datos');
      return res.status(404).json({ message: 'Rol "asesor" no encontrado' });
    }

    console.log('Rol "asesor" encontrado con id:', asesorRole.id);

    // Obtener los usuarios con el role_id correspondiente
    const asesors = await User.findAll({
      where: { role_id: asesorRole.id },
      attributes: ['id', 'username'], // Ajusta según los campos que necesites
    });

    console.log('Usuarios obtenidos con el rol de asesor:', asesors);

    res.status(200).json(asesors);
  } catch (error) {
    console.error('Error al obtener asesores:', error.message);
    console.error('Detalles del error:', error);

    res.status(500).json({
      message: 'Error obteniendo asesores',
      error: error.message,
    });
  }
};




  
