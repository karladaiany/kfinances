const express = require('express');
const router = express.Router();

// Rotas básicas de importação PDF (implementação básica)
router.post('/', (req, res) => {
  res.json({ message: 'Importação PDF - endpoint em desenvolvimento' });
});

module.exports = router;
