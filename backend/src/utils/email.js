const nodemailer = require('nodemailer');
const logger = require('./logger');

// Configuração do serviço de e-mail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Função para enviar e-mails
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `FinançasPro <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };
    
    // Adicionar anexos se fornecidos
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    
    const info = await transporter.sendMail(mailOptions);
    logger.info(`E-mail enviado: ${info.messageId}`);
    
    return info;
  } catch (error) {
    logger.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};

// Modelos de e-mail
exports.emailTemplates = {
  // Template para convite de família
  familyInvite: (name, inviterName, familyName, inviteLink) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #3498db; text-align: center;">Convite para o FinançasPro</h1>
        <p>Olá ${name},</p>
        <p><strong>${inviterName}</strong> convidou você para participar da família <strong>${familyName}</strong> no FinançasPro, uma plataforma completa para gestão financeira familiar.</p>
        <p>Com o FinançasPro, você pode:</p>
        <ul>
          <li>Acompanhar despesas e receitas da família</li>
          <li>Gerenciar contas bancárias e cartões de crédito</li>
          <li>Visualizar relatórios detalhados</li>
          <li>Importar extratos e faturas automaticamente</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Aceitar Convite</a>
        </div>
        <p>Este convite expira em 7 dias.</p>
        <p>Atenciosamente,<br>Equipe FinançasPro</p>
      </div>
    `;
  },
  
  // Template para notificação de assinatura expirando
  subscriptionExpiring: (name, daysLeft, renewLink) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #e74c3c; text-align: center;">Sua Assinatura Está Expirando</h1>
        <p>Olá ${name},</p>
        <p>Sua assinatura do FinançasPro expirará em <strong>${daysLeft} dias</strong>.</p>
        <p>Para continuar aproveitando todos os recursos da plataforma, renove sua assinatura antes do vencimento.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${renewLink}" style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Renovar Agora</a>
        </div>
        <p>Se você tiver alguma dúvida, entre em contato com nosso suporte.</p>
        <p>Atenciosamente,<br>Equipe FinançasPro</p>
      </div>
    `;
  },
  
  // Template para aprovação de acesso
  accessApproved: (name, loginLink) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #2ecc71; text-align: center;">Acesso Aprovado!</h1>
        <p>Olá ${name},</p>
        <p>Temos o prazer de informar que sua solicitação de acesso ao FinançasPro foi <strong>aprovada</strong>!</p>
        <p>Você agora tem acesso completo à plataforma por um período de teste de 7 dias.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginLink}" style="background-color: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Plataforma</a>
        </div>
        <p>Aproveite todos os recursos e descubra como o FinançasPro pode transformar sua gestão financeira familiar.</p>
        <p>Atenciosamente,<br>Equipe FinançasPro</p>
      </div>
    `;
  }
};
