const express = require('express');
const router = express.Router();

// Rotas básicas de importação (implementação básica)
router.post('/excel', (req, res) => {
  res.json({ message: 'Importação Excel - endpoint em desenvolvimento' });
});

router.post('/csv', (req, res) => {
  res.json({ message: 'Importação CSV - endpoint em desenvolvimento' });
});

module.exports = router;
