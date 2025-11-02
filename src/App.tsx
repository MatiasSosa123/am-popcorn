import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CartDisplay from './components/CartDisplay';
// import ProductList from './components/ProductList';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './hooks/useAuth';
import DatabaseInitializer from './components/DatabaseInitializer';
import { useProducts } from './hooks/useProducts';
import ProductCard from './components/ProductCard';
import './index.css';

const App: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      console.log('✅ PWA puede instalarse!', e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    console.log('🔍 canInstall value:', canInstall);
    console.log('🔍 DeferredPrompt:', deferredPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [canInstall, deferredPrompt]);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
        console.log('Usuario aceptó instalar la PWA');
      }
    }
  };

  // Componente para la página principal (tienda)
  const HomePage: React.FC = () => (
    <div>
      <header style={{ 
        backgroundColor: '#cc0000', 
        color: 'white', 
        padding: '1rem', 
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}><u>AM POPCORN</u> 🍿</h1>

        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {canInstall && (
            <button 
              onClick={installPWA}
              style={{ 
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: '#cc0000', 
                padding: '10px 20px', 
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
                border: '2px solid #f3c332',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                margin: '10px'
              }}
            >
              INSTALAR APP
            </button>
          )}
        </div>
      </header>

      <div style={{
        backgroundColor: '#f3c332',
        color: '#cc0000',
        textAlign: 'center',
        padding: '8px',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        ¡¿ES TU PRIMERA COMPRA?! Usa el código: <strong><u>PRIMERA-COMPRA</u></strong> para 35% de descuento
      </div>
      
      <main className="product-grid" style={{ paddingBottom: '80px' }}>
        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Cargando productos... 🍿</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
        
        {products
          .filter(product => product.inStock)
          .map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </main>
    </div>
  );

  return (
    <DatabaseInitializer>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartDisplay />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Footer solo en las páginas de tienda y carrito */}
              <Routes>
                <Route path="/" element={
                  <footer 
                    style={{ 
                      backgroundColor: '#cc0000', 
                      color: 'white',
                      padding: '1rem 0', 
                      textAlign: 'center', 
                      position: 'fixed', 
                      bottom: 0,
                      height: '6%', 
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <b><p style={{ margin: 0, lineHeight: '1.5' }}>&copy; 2025 AM Popcorn Derechos Reservados</p></b>
                  </footer>
                } />
                <Route path="/cart" element={
                  <footer 
                    style={{ 
                      backgroundColor: '#cc0000', 
                      color: 'white',
                      padding: '1rem 0', 
                      textAlign: 'center', 
                      position: 'fixed', 
                      bottom: 0, 
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <b><p style={{ margin: 0, lineHeight: '0.5' }}>&copy; 2025 AM Popcorn Derechos Reservados</p></b>
                  </footer>
                } />
                {/* No mostrar footer en admin */}
                <Route path="/admin" element={null} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </DatabaseInitializer>
  );
};

export default App;