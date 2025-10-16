import React from 'react';
import ProductCard from './components/ProductCard';
import CartDisplay from './components/CartDisplay';
import { Product } from './types';
import './index.css';

// DATOS DE LOS PRODUCTOS
const mockProducts: Product[] = [
  { id: 1, name: 'Combo Dulce', category: 'POCHOCLOS', type: 'Dulces', price: 1500 },
  { id: 2, name: 'Combo Salado', category: 'POCHOCLOS', type: 'Salados', price: 1500 },
  { id: 3, name: 'Combo Miti Miti', category: 'POCHOCLOS', type: 'Miti Miti', price: 1800 },
  { id: 4, name: 'Jugo de Durazno', category: 'BEBIDA', type: 'Caja de juguitos', price: 650 },
  { id: 5, name: 'Jugo de Manzana', category: 'BEBIDA', type: 'Caja de juguitos', price: 650 },
  { id: 6, name: 'Jugo Multifruta', category: 'BEBIDA', type: 'Caja de juguitos', price: 650 },
  { id: 7, name: 'Vaso de Coca-Cola', category: 'BEBIDA', type: 'Vasos de gaseosas', price: 500 },
  { id: 8, name: 'Vaso de Pritty', category: 'BEBIDA', type: 'Vasos de gaseosas', price: 500 },
];

const App: React.FC = () => {
  return (
    <div>
      <header style={{ backgroundColor: '#cc0000', color: 'white', padding: '0.1px', textAlign: 'center' }}>
        <h1><u>AM POPCORN</u> 🍿🥤</h1>
      </header>
      
      <CartDisplay />
      
      <main className="product-grid">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>

      <footer style={{ backgroundColor: '#cc0000', color: 'white', padding: '0.5px', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>
        <b><p>&copy; 2025 AM Popcorn Derechos Reservados por el Instituto Remedios de Escalada de San Martín</p></b>
      </footer>
    </div>
  );
};

export default App;