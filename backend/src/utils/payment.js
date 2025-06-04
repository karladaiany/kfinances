const mercadopago = require('mercadopago');
const logger = require('./logger');

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Funções para integração com o Mercado Pago
const paymentService = {
  // Criar uma assinatura
  createSubscription: async (userData) => {
    try {
      const subscriptionData = {
        preapproval_plan_id: process.env.MP_PLAN_ID,
        reason: 'Assinatura FinançasPro',
        payer_email: userData.email,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: parseFloat(process.env.SUBSCRIPTION_PRICE),
          currency_id: 'BRL'
        },
        back_url: `${process.env.FRONTEND_URL}/payment/callback`,
        status: 'authorized'
      };

      const subscription = await mercadopago.preapproval.create(subscriptionData);
      logger.info(`Assinatura criada para ${userData.email}: ${subscription.id}`);
      
      return subscription;
    } catch (error) {
      logger.error('Erro ao criar assinatura:', error);
      throw error;
    }
  },

  // Obter detalhes de uma assinatura
  getSubscription: async (subscriptionId) => {
    try {
      const subscription = await mercadopago.preapproval.findById(subscriptionId);
      return subscription;
    } catch (error) {
      logger.error(`Erro ao obter assinatura ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Cancelar uma assinatura
  cancelSubscription: async (subscriptionId) => {
    try {
      const result = await mercadopago.preapproval.update({
        id: subscriptionId,
        status: 'cancelled'
      });
      
      logger.info(`Assinatura ${subscriptionId} cancelada`);
      return result;
    } catch (error) {
      logger.error(`Erro ao cancelar assinatura ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Processar webhook de pagamento
  processWebhook: async (data) => {
    try {
      const { type, data: webhookData } = data;
      
      // Processar diferentes tipos de eventos
      switch (type) {
        case 'subscription_preapproval':
          // Atualização de status de assinatura
          const subscriptionId = webhookData.id;
          const subscription = await mercadopago.preapproval.findById(subscriptionId);
          
          logger.info(`Atualização de assinatura ${subscriptionId}: ${subscription.status}`);
          
          // Retornar dados para atualização no banco
          return {
            type: 'subscription_update',
            subscriptionId,
            status: subscription.status,
            lastPaymentDate: subscription.last_payment_date,
            nextPaymentDate: subscription.next_payment_date
          };
          
        case 'payment':
          // Pagamento recebido
          const paymentId = webhookData.id;
          const payment = await mercadopago.payment.findById(paymentId);
          
          logger.info(`Pagamento ${paymentId} recebido: ${payment.status}`);
          
          // Retornar dados para processamento
          return {
            type: 'payment_received',
            paymentId,
            status: payment.status,
            amount: payment.transaction_amount,
            date: payment.date_created,
            subscriptionId: payment.subscription_id
          };
          
        default:
          logger.info(`Webhook não processado: ${type}`);
          return null;
      }
    } catch (error) {
      logger.error('Erro ao processar webhook:', error);
      throw error;
    }
  },

  // Gerar link de pagamento para assinatura
  generatePaymentLink: async (userData) => {
    try {
      const preference = {
        items: [
          {
            title: 'Assinatura FinançasPro',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: parseFloat(process.env.SUBSCRIPTION_PRICE)
          }
        ],
        payer: {
          email: userData.email,
          name: userData.name
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`
        },
        auto_return: 'approved',
        external_reference: userData.id
      };

      const response = await mercadopago.preferences.create(preference);
      logger.info(`Link de pagamento gerado para ${userData.email}`);
      
      return response.init_point;
    } catch (error) {
      logger.error('Erro ao gerar link de pagamento:', error);
      throw error;
    }
  }
};

module.exports = paymentService;
