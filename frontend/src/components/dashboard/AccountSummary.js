import React from 'react';

const AccountSummary = ({ totalBalance, accounts, creditCards }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Saldo Total</h3>
        <p style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: totalBalance >= 0 ? '#27ae60' : '#e74c3c',
          margin: 0
        }}>
          R$ {totalBalance?.toFixed(2) || '0,00'}
        </p>
      </div>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Contas</h3>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#3498db',
          margin: 0
        }}>
          {accounts?.length || 0}
        </p>
      </div>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Cartões</h3>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#9b59b6',
          margin: 0
        }}>
          {creditCards?.length || 0}
        </p>
      </div>
    </div>
  );
};

export default AccountSummary;
