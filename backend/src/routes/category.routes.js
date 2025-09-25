const express = require('express');
const router = express.Router();

// Rotas básicas de categorias (implementação básica)
router.get('/', (req, res) => {
  res.json({ message: 'Categorias - endpoint em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar categoria - endpoint em desenvolvimento' });
});

module.exports = router;
