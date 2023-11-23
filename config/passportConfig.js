console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);
console.log('GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

console.log('oh hi')

// Estrategia de autenticación con GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  console.log('done this:', accessToken, refreshToken, profile, done)
  try {
    // Añadir verificación de correos electrónicos
    const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

    if (!email) {
      return done(null, false, { message: 'El usuario no tiene un correo electrónico público asociado en GitHub.' });
    }

    const user = await User.findOne({ email });
    console.log('user:',user);
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      email,
      role: 'usuario',
      githubId: profile.id,
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error('Error en la estrategia de GitHub:', error);
    return done(error);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia de autenticación local
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    return done(error);
  }
}));

