const express = require('express');
const router = express.Router();

// Rotas básicas de pagamento (implementação básica)
router.post('/create-subscription', (req, res) => {
  res.json({ message: 'Criar assinatura - endpoint em desenvolvimento' });
});

router.post('/webhook', (req, res) => {
  res.json({ message: 'Webhook de pagamento - endpoint em desenvolvimento' });
});

// Exportar routers separados
router.webhookRouter = express.Router();
router.webhookRouter.post('/', (req, res) => {
  res.json({ message: 'Webhook de pagamento - endpoint em desenvolvimento' });
});

router.protectedRouter = express.Router();
router.protectedRouter.get('/subscription', (req, res) => {
  res.json({ message: 'Status da assinatura - endpoint em desenvolvimento' });
});

module.exports = router;
