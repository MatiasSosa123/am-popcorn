import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import DatabaseInitializer from './components/DatabaseInitializer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatabaseInitializer>
      <CartProvider>
        <App />
      </CartProvider>
    </DatabaseInitializer>
  </React.StrictMode>
);