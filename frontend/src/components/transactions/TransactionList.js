import React from 'react';

const TransactionList = ({ transactions, title = "Transações", compact = false }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>{title}</h3>
        <p style={{ color: '#666' }}>Nenhuma transação encontrada</p>
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
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {transactions.slice(0, compact ? 5 : 10).map((transaction, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: compact ? '0.5rem' : '0.75rem',
            background: '#f8f9fa',
            borderRadius: '4px',
            borderLeft: `4px solid ${transaction.type === 'income' ? '#27ae60' : '#e74c3c'}`
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                margin: '0 0 0.25rem 0', 
                fontWeight: 'bold', 
                color: '#333',
                fontSize: compact ? '0.875rem' : '1rem'
              }}>
                {transaction.description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#666' }}>
                <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                {transaction.category && <span>{transaction.category}</span>}
                {transaction.account && <span>{transaction.account}</span>}
              </div>
            </div>
            <span style={{
              fontWeight: 'bold',
              color: transaction.type === 'income' ? '#27ae60' : '#e74c3c',
              fontSize: compact ? '0.875rem' : '1rem'
            }}>
              {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount?.toFixed(2) || '0,00'}
            </span>
          </div>
        ))}
      </div>
      {compact && transactions.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button style={{
            background: 'transparent',
            border: '1px solid #3498db',
            color: '#3498db',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Ver todas as transações
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
