const authMiddleware = {
    // Middleware para verificar si el usuario está autenticado
    isLoggedIn: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    },
  
  
    // Middleware para verificar si el usuario tiene el rol de administrador
    isAdmin: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
      }
      res.redirect('/login');
    },
  };
  
  module.exports = authMiddleware;
  