import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Configurações</h1>
        <p>Configure suas preferências e dados pessoais.</p>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Módulo de Configurações</h3>
          <p>Funcionalidades em desenvolvimento...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
