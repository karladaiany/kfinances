const express = require('express');
const router = express.Router();

// Rotas básicas de gerenciamento de usuários (implementação básica)
router.get('/users', (req, res) => {
  res.json({ message: 'Listar usuários - endpoint em desenvolvimento' });
});

router.put('/users/:id', (req, res) => {
  res.json({ message: 'Atualizar usuário - endpoint em desenvolvimento' });
});

module.exports = router;
