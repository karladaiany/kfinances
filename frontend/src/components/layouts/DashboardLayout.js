import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

const DashboardLayout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Transações', href: '/transactions', icon: '💰' },
    { name: 'Contas', href: '/accounts', icon: '🏦' },
    { name: 'Categorias', href: '/categories', icon: '📁' },
    { name: 'Relatórios', href: '/reports', icon: '📈' },
    { name: 'Configurações', href: '/settings', icon: '⚙️' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '60px',
        background: '#2c3e50',
        color: 'white',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            {sidebarOpen && <h2 style={{ margin: 0, fontSize: '1.2rem' }}>FinançasPro</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.5rem'
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: router.pathname === item.href ? '#34495e' : 'transparent',
                  transition: 'background 0.2s ease'
                }}>
                  <span style={{ fontSize: '1.2rem', marginRight: sidebarOpen ? '0.75rem' : '0' }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem',
            background: '#34495e',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#3498db',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: sidebarOpen ? '0.75rem' : '0',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{user.email}</div>
              </div>
            )}
          </div>
          
          <button
            onClick={logout}
            style={{
              width: '100%',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '250px' : '60px',
        width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)',
        transition: 'all 0.3s ease'
      }}>
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
