require('dotenv').config();

const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const viewsRouter = require('./viewsRouter');
const passportConfig = require('./config/passportConfig.js');
const { app, server, io } = require('./app');
const passport = require('passport');

// Configurar Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para manejar solicitudes JSON
app.use(bodyParser.json());

// Configurar conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configuración de Passport
//passportConfig();  // Agregado: Configurar Passport

// Configurar las rutas
app.use('/', viewsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
});

// Escuchar en el puerto especificado
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
