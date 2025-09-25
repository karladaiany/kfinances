import React from 'react';

const MonthlyComparison = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Comparação Mensal</h3>
        <p style={{ color: '#666' }}>Nenhum dado disponível</p>
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
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Comparação Mensal</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {monthlyData.map((month, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            borderBottom: index < monthlyData.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <span style={{ color: '#333' }}>{month.month}</span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#27ae60' }}>
                R$ {month.income?.toFixed(2) || '0,00'}
              </span>
              <span style={{ color: '#e74c3c' }}>
                R$ {month.expense?.toFixed(2) || '0,00'}
              </span>
              <span style={{
                fontWeight: 'bold',
                color: month.balance >= 0 ? '#27ae60' : '#e74c3c'
              }}>
                R$ {month.balance?.toFixed(2) || '0,00'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyComparison;
