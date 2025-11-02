import React from 'react';
import type { Product } from '../types';

interface RealTimeProductCardProps {
  product: Product;
}

const RealTimeProductCard: React.FC<RealTimeProductCardProps> = ({ product }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={product.imagen || (product.category === 'POCHOCLOS' ? '/images/pochoclos-default.jpg' : '/images/bebida-default.jpg')} 
        alt={product.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '12px'
        }}
      />
      <h3 style={{ margin: '0 0 8px 0', color: '#cc0000' }}>{product.name}</h3>
      <p style={{ margin: '0 0 8px 0', color: '#666' }}>{product.type}</p>
      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>${product.price?.toFixed(2)}</p>
      <p style={{ 
        margin: '0', 
        color: product.stock && product.stock > 0 ? 'green' : 'red',
        fontWeight: 'bold'
      }}>
        Stock: {product.stock || 0}
      </p>
    </div>
  );
};

export default RealTimeProductCard;