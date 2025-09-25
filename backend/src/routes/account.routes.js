const express = require('express');
const router = express.Router();

// Rotas básicas de contas (implementação básica)
router.get('/', (req, res) => {
  res.json({ message: 'Contas - endpoint em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar conta - endpoint em desenvolvimento' });
});

module.exports = router;
