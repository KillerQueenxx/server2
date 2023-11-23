const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('Error de conexión a MongoDB:', error);
});

db.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
});

module.exports = db;


// funcion para inicializar la base de datos
// iniciar los modelos
