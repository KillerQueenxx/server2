const exphbs = require('express-handlebars');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const viewsRouter = require('./viewsRouter');
require('dotenv').config(); // 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;
app.use('/', viewsRouter);

// Configura Handlebars
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
// Definir esquema de Usuario
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

// Rutas para login y registro
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      res.render('login', { error: 'Credenciales incorrectas' });
      return;
    }

    req.session.user = user;
    res.redirect('/products');
  } catch (error) {
    console.error('Error al realizar el login:', error);
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.render('register', { error: 'El usuario ya existe' });
      return;
    }

    const user = new User({ email, password, role: 'usuario' });
    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error al realizar el registro:', error);
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


// Definir esquema de Productos
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  available: Boolean,
});

// Definir modelo de Productos
let Product;
try {
  Product = mongoose.model('Product');
} catch (error) {
  Product = mongoose.model('Product', productSchema);
}

// Definir esquema de Carritos
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],
});

// Definir modelo de Carritos
let Cart;
try {
  Cart = mongoose.model('Cart');
} catch (error) {
  Cart = mongoose.model('Cart', cartSchema);
}

// Usa el nuevo router para las vistas
app.use('/', viewsRouter);

// Ruta para la vista home
app.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filters = {};
    if (query) {
      const regex = new RegExp(query, 'i');
      filters.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    const sortOrder = sort === 'desc' ? -1 : 1;

    const products = await Product.find(filters)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ price: sortOrder });

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.render('home', {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page: parseInt(page),
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});