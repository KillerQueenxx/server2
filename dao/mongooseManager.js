const mongoose = require('mongoose');

class MongooseManager {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect('tu_url_de_conexion_a_mongodb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conexión a MongoDB exitosa');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
    }
  }
}

module.exports = MongooseManager;
