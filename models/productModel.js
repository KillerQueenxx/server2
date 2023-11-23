const mongoose = require('mongoose');
const db = require('../db');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Product = db.model('Product', productSchema);

module.exports = Product;
