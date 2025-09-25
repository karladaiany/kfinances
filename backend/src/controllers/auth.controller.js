const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/user.model');
const Family = require('../models/family.model');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');

// Registro de usuário
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está em uso' });
    }

    // Verificar se há um código de convite válido
    if (!inviteCode) {
      // Se não houver código, verificar se o registro aberto está permitido
      const isOpenRegistrationAllowed = process.env.ALLOW_OPEN_REGISTRATION === 'true';
      if (!isOpenRegistrationAllowed) {
        return res.status(403).json({ 
          message: 'Registro requer um código de convite válido',
          requiresInvite: true
        });
      }
    } else {
      // Verificar o código de convite
      // Implementação depende do modelo de convite
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'guest', // Papel inicial
      isEmailVerified: false,
      subscription: {
        status: 'trial',
        trialEndsAt: new Date(Date.now() + process.env.TRIAL_DAYS * 24 * 60 * 60 * 1000)
      }
    });

    // Salvar usuário
    await newUser.save();

    // Enviar e-mail de verificação (apenas se as credenciais de email estiverem configuradas)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && 
        process.env.EMAIL_USER !== 'seu_email@gmail.com' && 
        process.env.EMAIL_PASSWORD !== 'sua_senha_de_app_do_gmail') {
      
      const verificationToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const verificationUrl = `${process.env.API_URL}/api/auth/verify-email/${verificationToken}`;
      
      try {
        await sendEmail({
          to: email,
          subject: 'Verifique seu e-mail - FinançasPro',
          html: `
            <h1>Bem-vindo ao FinançasPro!</h1>
            <p>Olá ${name},</p>
            <p>Obrigado por se registrar. Por favor, verifique seu e-mail clicando no link abaixo:</p>
            <a href="${verificationUrl}">Verificar E-mail</a>
            <p>Este link expira em 24 horas.</p>
            <p>Atenciosamente,<br>Equipe FinançasPro</p>
          `
        });
      } catch (emailError) {
        logger.warn('Erro ao enviar email de verificação, mas usuário foi criado:', emailError.message);
        // Em desenvolvimento, marcar email como verificado automaticamente
        newUser.isEmailVerified = true;
        await newUser.save();
      }
    } else {
      // Em desenvolvimento sem email configurado, marcar como verificado automaticamente
      logger.info('Email não configurado - marcando como verificado automaticamente em desenvolvimento');
      newUser.isEmailVerified = true;
      await newUser.save();
    }

    // Responder com sucesso
    const message = newUser.isEmailVerified ? 
      'Usuário registrado com sucesso. Sua conta está ativa e pronta para uso.' :
      'Usuário registrado com sucesso. Verifique seu e-mail para ativar sua conta.';
    
    res.status(201).json({
      message,
      userId: newUser._id,
      emailVerified: newUser.isEmailVerified
    });
  } catch (error) {
    logger.error('Erro no registro:', error);
    next(error);
  }
};

// Login de usuário
exports.login = async (req, res, next) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    // Encontrar usuário pelo e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se o e-mail foi verificado
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Por favor, verifique seu e-mail antes de fazer login',
        requiresEmailVerification: true
      });
    }

    // Verificar 2FA se estiver habilitado
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(403).json({ 
          message: 'Autenticação de dois fatores necessária',
          requires2FA: true
        });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode
      });

      if (!isValid) {
        return res.status(401).json({ message: 'Código de autenticação inválido' });
      }
    }

    // Verificar status da assinatura
    if (user.isTrialExpired() && user.subscription.status !== 'active') {
      return res.status(402).json({
        message: 'Seu período de teste expirou. Por favor, assine para continuar.',
        requiresPayment: true
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    // Responder com tokens
    res.status(200).json({
      message: 'Login realizado com sucesso',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription.status,
        trialEndsAt: user.subscription.trialEndsAt
      }
    });
  } catch (error) {
    logger.error('Erro no login:', error);
    next(error);
  }
};

// Configuração de 2FA
exports.setup2FA = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Gerar segredo para 2FA
    const secret = speakeasy.generateSecret({
      name: `FinancasPro:${req.user.email}`
    });
    
    // Gerar QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    
    // Atualizar usuário com o segredo
    await User.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32
    });
    
    res.status(200).json({
      message: 'Configuração de 2FA iniciada',
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    logger.error('Erro na configuração de 2FA:', error);
    next(error);
  }
};

// Verificar e ativar 2FA
exports.verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    // Verificar token
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });
    
    if (!isValid) {
      return res.status(401).json({ message: 'Código inválido' });
    }
    
    // Ativar 2FA
    user.twoFactorEnabled = true;
    await user.save();
    
    res.status(200).json({ message: 'Autenticação de dois fatores ativada com sucesso' });
  } catch (error) {
    logger.error('Erro na verificação de 2FA:', error);
    next(error);
  }
};

// Atualizar token de acesso usando refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido' });
    }
    
    // Verificar refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
      }
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Gerar novo token de acesso
      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      
      res.status(200).json({
        accessToken
      });
    });
  } catch (error) {
    logger.error('Erro ao atualizar token:', error);
    next(error);
  }
};

// Verificação de e-mail
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
      }
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Marcar e-mail como verificado
      user.isEmailVerified = true;
      await user.save();
      
      // Redirecionar para página de sucesso
      res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
    });
  } catch (error) {
    logger.error('Erro na verificação de e-mail:', error);
    next(error);
  }
};

// Solicitar redefinição de senha
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Por segurança, não informamos se o e-mail existe ou não
      return res.status(200).json({ message: 'Se o e-mail estiver registrado, você receberá instruções para redefinir sua senha' });
    }
    
    // Gerar token de redefinição
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Enviar e-mail
    await sendEmail({
      to: email,
      subject: 'Redefinição de Senha - FinançasPro',
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Olá ${user.name},</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
        <p>Atenciosamente,<br>Equipe FinançasPro</p>
      `
    });
    
    res.status(200).json({ message: 'Se o e-mail estiver registrado, você receberá instruções para redefinir sua senha' });
  } catch (error) {
    logger.error('Erro na solicitação de redefinição de senha:', error);
    next(error);
  }
};

// Redefinir senha
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
      }
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Hash da nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Atualizar senha
      user.password = hashedPassword;
      await user.save();
      
      res.status(200).json({ message: 'Senha redefinida com sucesso' });
    });
  } catch (error) {
    logger.error('Erro na redefinição de senha:', error);
    next(error);
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password -twoFactorSecret');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Obter informações da família se aplicável
    let familyInfo = null;
    if (user.familyId) {
      familyInfo = await Family.findById(user.familyId).select('name members');
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled,
        subscription: user.subscription,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      family: familyInfo
    });
  } catch (error) {
    logger.error('Erro ao obter perfil:', error);
    next(error);
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar, updatedAt: Date.now() },
      { new: true }
    ).select('-password -twoFactorSecret');
    
    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Erro ao atualizar perfil:', error);
    next(error);
  }
};

// Alterar senha
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Atualizar senha
    user.password = hashedPassword;
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    logger.error('Erro ao alterar senha:', error);
    next(error);
  }
};

// Logout (apenas para fins de registro)
exports.logout = async (req, res, next) => {
  try {
    // O logout real é feito no cliente removendo os tokens
    // Aqui apenas registramos o evento
    logger.info(`Usuário ${req.user.userId} fez logout`);
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    logger.error('Erro no logout:', error);
    next(error);
  }
};
