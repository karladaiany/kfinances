const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Middleware para autenticação de usuários
exports.authenticate = (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
      }

      // Adicionar informações do usuário ao objeto de requisição
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Middleware para verificar permissões de usuário
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      // Converter string única para array
      if (typeof roles === 'string') {
        roles = [roles];
      }

      // Verificar se o usuário tem o papel necessário
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acesso proibido. Permissões insuficientes.' });
      }

      next();
    } catch (error) {
      logger.error('Erro no middleware de autorização:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  };
};

// Middleware para verificar status da assinatura
exports.checkSubscription = async (req, res, next) => {
  try {
    const User = require('../models/user.model');
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o usuário tem uma assinatura ativa ou está no período de teste
    if (!user.hasActiveSubscription()) {
      return res.status(402).json({
        message: 'Assinatura necessária para acessar este recurso.',
        requiresPayment: true,
        subscriptionStatus: user.subscription.status,
        trialEndsAt: user.subscription.trialEndsAt
      });
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware de verificação de assinatura:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Middleware para verificar pertencimento à família
exports.checkFamilyMembership = async (req, res, next) => {
  try {
    const familyId = req.params.familyId || req.body.familyId;
    
    if (!familyId) {
      return res.status(400).json({ message: 'ID da família não fornecido.' });
    }

    const Family = require('../models/family.model');
    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({ message: 'Família não encontrada.' });
    }

    // Verificar se o usuário é o proprietário ou membro da família
    const isOwner = family.ownerId.toString() === req.user.userId;
    const isMember = family.members.some(member => 
      member.userId.toString() === req.user.userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Acesso proibido. Você não é membro desta família.' });
    }

    // Adicionar informações da família ao objeto de requisição
    req.family = family;
    req.isOwner = isOwner;
    
    if (isMember) {
      req.memberInfo = family.members.find(member => 
        member.userId.toString() === req.user.userId
      );
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware de verificação de família:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
