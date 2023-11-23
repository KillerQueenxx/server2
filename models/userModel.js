
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});


userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
