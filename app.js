const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passportConfig');

const viewsRouter = require('./viewsRouter');
const db = require('./db');

const authController = require('./controllers/authController'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para manejar solicitudes JSON
app.use(bodyParser.json());

// Middleware para manejar sesiones con Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport
//passportConfig();

// Conexión a MongoDB
//db()

// Rutas
app.use('/', viewsRouter);

// Rutas de autenticación
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('home');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
});

module.exports = { app, server, io };
