const express = require('express');
const router = express.Router();

// Rotas básicas de cartões (implementação básica)
router.get('/', (req, res) => {
  res.json({ message: 'Cartões - endpoint em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar cartão - endpoint em desenvolvimento' });
});

module.exports = router;
