module.exports = {
  // Configurações de desenvolvimento
  database: {
    // Para desenvolvimento sem MongoDB local, usar uma string de conexão de teste
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/financas-pro-dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost'
  },
  
  // Configurações de desenvolvimento
  development: {
    // Desabilitar algumas verificações em desenvolvimento
    skipEmailVerification: true,
    skipPaymentVerification: true,
    allowTestUsers: true
  }
};
