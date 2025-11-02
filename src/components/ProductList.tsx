import React from 'react';
import RealTimeProductCard from './RealTimeProductCard';
import { useRealTimeStock } from '../hooks/useRealTimeStock';

const ProductList: React.FC = () => {
  const { products, loading, restockAll } = useRealTimeStock();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#cc0000',
        fontSize: '1.2rem'
      }}>
        <p>Cargando productos en tiempo real...</p>
      </div>
    );
  }

  return (
    <div>
      {/* BOTÓN ADMIN PARA REPONER STOCK */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <button
          onClick={restockAll}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          Reponer Todo el Stock (20 unidades)
        </button>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {products.map(product => (
          <RealTimeProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;