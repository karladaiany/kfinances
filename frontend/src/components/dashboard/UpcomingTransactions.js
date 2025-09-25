import React from 'react';

const UpcomingTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Próximas Transações</h3>
        <p style={{ color: '#666' }}>Nenhuma transação agendada</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Próximas Transações</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {transactions.slice(0, 5).map((transaction, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            background: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#333' }}>
                {transaction.description}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                {new Date(transaction.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span style={{
              fontWeight: 'bold',
              color: transaction.type === 'income' ? '#27ae60' : '#e74c3c'
            }}>
              {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount?.toFixed(2) || '0,00'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTransactions;
