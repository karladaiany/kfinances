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
import '../styles/dashboard.css';

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
      toast.error('Erro ao carregar dados do dashboard');
      console.error(error);
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
