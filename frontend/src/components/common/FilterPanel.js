import React, { useState } from 'react';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePeriodChange = (period) => {
    onFilterChange({ period });
  };

  const handleAccountChange = (accountId) => {
    const newAccounts = filters.accounts.includes(accountId)
      ? filters.accounts.filter(id => id !== accountId)
      : [...filters.accounts, accountId];
    onFilterChange({ accounts: newAccounts });
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ categories: newCategories });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#3498db',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Filtros
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1rem',
          minWidth: '300px',
          zIndex: 1000
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Período
            </label>
            <select
              value={filters.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="current_month">Mês Atual</option>
              <option value="last_month">Mês Anterior</option>
              <option value="last_3_months">Últimos 3 Meses</option>
              <option value="last_6_months">Últimos 6 Meses</option>
              <option value="current_year">Ano Atual</option>
              <option value="last_year">Ano Anterior</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Contas
            </label>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="checkbox"
                  checked={filters.accounts.length === 0}
                  onChange={() => onFilterChange({ accounts: [] })}
                />
                <span>Todas as contas</span>
              </label>
              {/* Aqui você pode mapear as contas disponíveis */}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Categorias
            </label>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="checkbox"
                  checked={filters.categories.length === 0}
                  onChange={() => onFilterChange({ categories: [] })}
                />
                <span>Todas as categorias</span>
              </label>
              {/* Aqui você pode mapear as categorias disponíveis */}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                onFilterChange({
                  period: 'current_month',
                  accounts: [],
                  categories: [],
                  members: []
                });
                setIsOpen(false);
              }}
              style={{
                background: 'transparent',
                border: '1px solid #ddd',
                color: '#666',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Limpar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
