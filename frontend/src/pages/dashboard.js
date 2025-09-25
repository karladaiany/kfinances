import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import TransactionList from '../components/transactions/TransactionList';
import AccountSummary from '../components/dashboard/AccountSummary';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import MonthlyComparison from '../components/dashboard/MonthlyComparison';
import UpcomingTransactions from '../components/dashboard/UpcomingTransactions';
import FilterPanel from '../components/common/FilterPanel';
// CSS movido para _app.js

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [filters, setFilters] = useState({
    period: 'current_month',
    accounts: [],
    categories: [],
    members: []
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [user, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/dashboard', filters);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Em caso de erro, usar dados de exemplo
      setDashboardData({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Financeiro</h1>
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        <div className="summary-cards">
          <AccountSummary 
            totalBalance={dashboardData?.totalBalance} 
            accounts={dashboardData?.accounts}
            creditCards={dashboardData?.creditCards}
          />
        </div>

        {/* Quick Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => router.push('/transactions')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Transações</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Gerencie suas transações</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => router.push('/accounts')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏦</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Contas</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Gerencie contas e cartões</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => router.push('/categories')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Categorias</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Organize por categorias</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => router.push('/reports')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Relatórios</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Visualize relatórios</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-container">
            <ExpenseChart 
              expensesByCategory={dashboardData?.expensesByCategory} 
            />
          </div>
          <div className="chart-container">
            <MonthlyComparison 
              monthlyData={dashboardData?.monthlyComparison} 
            />
          </div>
        </div>

        <div className="dashboard-tables">
          <div className="table-container">
            <UpcomingTransactions 
              transactions={dashboardData?.upcomingTransactions} 
            />
          </div>
          <div className="table-container">
            <TransactionList 
              transactions={dashboardData?.recentTransactions}
              title="Transações Recentes"
              compact={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
