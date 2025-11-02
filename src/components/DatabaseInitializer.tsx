import React, { useEffect, useState } from 'react';
import { initializeProducts } from '../hooks/useRealTimeStock';

const DatabaseInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsInitializing(true);
        await initializeProducts();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8efed'
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: '#cc0000',
          marginBottom: '20px'
        }}>
          Inicializando Base de Datos...
        </div>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #cc0000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8efed',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>
          Error de Conexión
        </h2>
        <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          No se pudo conectar con la base de datos. Por favor, recarga la página.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#cc0000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Recargar Página
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default DatabaseInitializer;