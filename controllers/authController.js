// authController.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar que no exista un usuario con el mismo email
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.render('register', { error: 'El usuario ya existe' });
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear un nuevo usuario
      const newUser = new User({ email, password: hashedPassword, role: 'usuario' });
      await newUser.save();

      res.redirect('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
    }
  },

  login: passport.authenticate('local', {
    successRedirect: '/products', // Redirige a la página de productos si la autenticación es exitosa
    failureRedirect: '/login',    // Redirige de nuevo al formulario de inicio de sesión si la autenticación falla
    failureFlash: true,           // Permite mostrar mensajes flash para errores de autenticación
  }),

  logout: (req, res) => {
    req.logout();
    res.redirect('/login');
  },

  githubLogin: passport.authenticate('github', {
    scope: ['user:email'],
  }),

  githubCallback: passport.authenticate('github', {
    successRedirect: '/products', // Redirige a la página de productos si la autenticación es exitosa
    failureRedirect: '/login',    // Redirige de nuevo al formulario de inicio de sesión si la autenticación falla
    failureFlash: true,           // Permite mostrar mensajes flash para errores de autenticación
  }),
};

module.exports = authController;
