import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Categories = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Categorias</h1>
        <p>Organize suas transações por categorias.</p>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Módulo de Categorias</h3>
          <p>Funcionalidades em desenvolvimento...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
