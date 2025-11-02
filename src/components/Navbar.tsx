import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { getTotalItems } = useCart();
  const location = useLocation();
  const totalItems = getTotalItems();

  // No mostrar navbar en la página de admin (ya que AdminPage tiene su propia navegación)
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: '#cc0000',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo y título */}
        <Link 
          to="/" 
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          🍿 AM Popcorn
        </Link>

        {/* Navegación */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          {/* Enlace a la tienda */}
          <Link 
            to="/inicio" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            Comprar
          </Link>

          {/* Enlace al carrito con contador */}
          <Link 
            to="/cart" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: location.pathname === '/cart' ? 'bold' : 'normal',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/cart' ? 'rgba(255,255,255,0.2)' : 'transparent',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#f3c332',
                color: '#cc0000',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Enlace al admin */}
          <Link 
            to="/admin" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: location.pathname === '/admin' ? 'bold' : 'normal',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.3s ease'
            }}          >
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;