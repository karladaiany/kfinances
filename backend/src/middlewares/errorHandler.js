const logger = require('../utils/logger');

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  logger.error('Erro capturado:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Erro de duplicação
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Dados duplicados',
      field: Object.keys(err.keyValue)[0]
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }

  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado'
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
