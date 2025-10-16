import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div style={{ backgroundColor: '#cc0000', color: 'white', padding: '15px', borderRadius: '8px' }}>
      <h3>{product.name}</h3>
      <p>{product.type} - {product.category}</p>
      <p>Precio: ${product.price.toFixed(2)}</p>
      <button 
        onClick={handleAddToCart}
        style={{ 
          backgroundColor: '#f3c332', 
          border: 'none', 
          padding: '10px 15px', 
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d4a413')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f3c332')}
      >
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ProductCard;