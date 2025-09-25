const express = require('express');
const router = express.Router();

// Rotas básicas de dashboard (implementação básica)
router.post('/', (req, res) => {
  // Dados de exemplo para demonstração
  const sampleData = {
    totalBalance: 12500.50,
    accounts: [
      { id: 1, name: 'Conta Corrente', balance: 8500.00, type: 'checking' },
      { id: 2, name: 'Poupança', balance: 4000.50, type: 'savings' }
    ],
    creditCards: [
      { id: 1, name: 'Cartão Visa', limit: 5000.00, used: 1200.00 },
      { id: 2, name: 'Cartão Mastercard', limit: 3000.00, used: 800.00 }
    ],
    expensesByCategory: [
      { name: 'Alimentação', amount: 1200.00 },
      { name: 'Transporte', amount: 800.00 },
      { name: 'Lazer', amount: 600.00 },
      { name: 'Saúde', amount: 400.00 },
      { name: 'Educação', amount: 300.00 }
    ],
    monthlyComparison: [
      { month: 'Janeiro', income: 5000, expenses: 3500 },
      { month: 'Fevereiro', income: 5200, expenses: 3800 },
      { month: 'Março', income: 4800, expenses: 3200 }
    ],
    upcomingTransactions: [
      { id: 1, description: 'Salário', amount: 5000.00, date: '2024-01-15', type: 'income' },
      { id: 2, description: 'Aluguel', amount: -1200.00, date: '2024-01-20', type: 'expense' },
      { id: 3, description: 'Conta de Luz', amount: -150.00, date: '2024-01-25', type: 'expense' }
    ],
    recentTransactions: [
      { id: 1, description: 'Supermercado', amount: -250.00, date: '2024-01-10', category: 'Alimentação' },
      { id: 2, description: 'Gasolina', amount: -80.00, date: '2024-01-09', category: 'Transporte' },
      { id: 3, description: 'Freelance', amount: 800.00, date: '2024-01-08', category: 'Renda Extra' },
      { id: 4, description: 'Netflix', amount: -45.00, date: '2024-01-07', category: 'Lazer' },
      { id: 5, description: 'Farmácia', amount: -120.00, date: '2024-01-06', category: 'Saúde' }
    ]
  };

  res.json(sampleData);
});

module.exports = router;
