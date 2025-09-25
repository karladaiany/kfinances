const express = require('express');
const router = express.Router();

// Rotas básicas de família (implementação básica)
router.get('/', (req, res) => {
  res.json({ message: 'Família - endpoint em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar família - endpoint em desenvolvimento' });
});

module.exports = router;
