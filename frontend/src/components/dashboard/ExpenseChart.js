import React from 'react';

const ExpenseChart = ({ expensesByCategory }) => {
  if (!expensesByCategory || expensesByCategory.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Gastos por Categoria</h3>
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
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Gastos por Categoria</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expensesByCategory.map((category, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: `hsl(${index * 137.5}, 70%, 50%)`,
              borderRadius: '4px'
            }}></div>
            <span style={{ flex: 1, color: '#333' }}>{category.name}</span>
            <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
              R$ {category.amount?.toFixed(2) || '0,00'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
