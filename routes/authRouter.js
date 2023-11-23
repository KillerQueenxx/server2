const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authController.githubLoginCallback);


module.exports = router;
