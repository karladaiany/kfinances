const express = require('express');
const router = express.Router();

// Importação dos controladores de rotas
const authRoutes = require('./auth.routes');
const familyRoutes = require('./family.routes');
const accountRoutes = require('./account.routes');
const cardRoutes = require('./card.routes');
const categoryRoutes = require('./category.routes');
const transactionRoutes = require('./transaction.routes');
const importRoutes = require('./import.routes');
const pdfImportRoutes = require('./pdf-import.routes');
const paymentRoutes = require('./payment.routes');
const userManagementRoutes = require('./user-management.routes');
const dashboardRoutes = require('./dashboard.routes');

// Middleware de autenticação
const { authenticate } = require('../middlewares/auth');

// Rotas públicas
router.use('/auth', authRoutes);
router.use('/payment/webhook', paymentRoutes.webhookRouter);

// Middleware de autenticação para rotas protegidas
router.use(authenticate);

// Rotas protegidas
router.use('/family', familyRoutes);
router.use('/accounts', accountRoutes);
router.use('/cards', cardRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/import', importRoutes);
router.use('/pdf-import', pdfImportRoutes);
router.use('/payment', paymentRoutes.protectedRouter);
router.use('/user-management', userManagementRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
