const express = require('express');
const router = express.Router();

// Rotas básicas de transações (implementação básica)
router.get('/', (req, res) => {
  res.json({ message: 'Transações - endpoint em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar transação - endpoint em desenvolvimento' });
});

module.exports = router;
