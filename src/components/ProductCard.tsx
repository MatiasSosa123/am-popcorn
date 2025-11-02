import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getCurrentStock } from '../hooks/useRealTimeStock';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [currentStock, setCurrentStock] = useState(product.stock);

  // Actualizar stock en tiempo real
  useEffect(() => {
    const checkStock = async () => {
      try {
        const stock = await getCurrentStock(product.id);
        setCurrentStock(stock);
      } catch (error) {
        console.error('Error getting current stock:', error);
      }
    };

    // Verificar stock inicial
    checkStock();

    // Verificar stock cada 5 segundos
    const interval = setInterval(checkStock, 5000);
    return () => clearInterval(interval);
  }, [product.id]);

  const handleAddToCart = async () => {
    if (currentStock > 0 && !isAdding) {
      setIsAdding(true);
      
      try {
        await addItem({
          ...product,
          stock: currentStock
        });
        
        // Actualizar stock local después de agregar al carrito
        setCurrentStock(currentStock - 1);
        
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error al agregar al carrito');
        
        // Si hay error, volver a verificar el stock real
        const stock = await getCurrentStock(product.id);
        setCurrentStock(stock);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const isInStock = currentStock > 0;

  // ... (resto de tu código de ProductCard igual)
  const getProductImage = () => {
    if (product.imagen) {
      return product.imagen;
    }
    
    const productName = product.name.toLowerCase();
    
    if (productName.includes('pochoclos salados')) {
      return '/images/Pochoclos-Salados.png';
    } else if (productName.includes('vaso de pritty')) {
      return '/images/Vaso-Pritty.png';
    } else if (productName.includes('vaso de gaseosa') || productName.includes('coca cola')) {
      return '/images/Vaso-CocaCola.jpg';
    } else if (productName.includes('pochoclos dulces')) {
      return '/images/Pochoclos-Salados.png';
    } else if (productName.includes('pochoclos miti miti')) {
      return '/images/Pochoclos-Salados.png';
    } else if (productName.includes('jugo de durazno')) {
      return '/images/Jugo-Durazno.png';
    } else if (productName.includes('jugo multifruta')) {
      return '/images/Jugo-Multifruta.png';
    } else if (productName.includes('jugo de manzana')) {
      return '/images/Jugo-Manzana.png';
    }
    
    if (product.category === 'POCHOCLOS') {
      return '/images/pochoclos-default.jpg';
    } else if (product.category === 'BEBIDA') {
      return '/images/bebida-default.jpg';
    }
    
    return '/images/default-product.jpg';
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: isInStock ? '2px solid #f3c332' : '2px solid #e0e0e0',
      opacity: isInStock ? 1 : 0.7,
      position: 'relative',
      overflow: 'hidden',
      height: '380px',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      if (isInStock) {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    }}
    >
      {/* ETIQUETA DE STOCK */}
      {!isInStock && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#cc0000',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 2
        }}>
          SIN STOCK
        </div>
      )}

      {/* CONTENEDOR DE IMAGEN */}
      <div style={{
        height: '200px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f8f8f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px'
      }}>
        <img 
          src={getProductImage()} 
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            if (product.category === 'POCHOCLOS') {
              e.currentTarget.src = '/images/pochoclos-default.jpg';
            } else if (product.category === 'BEBIDA') {
              e.currentTarget.src = '/images/bebida-default.jpg';
            } else {
              e.currentTarget.src = '/images/default-product.jpg';
            }
          }}
        />
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div style={{ 
        padding: '15px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 8px 0',
            color: '#cc0000',
            fontSize: '1.1rem',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '1.3'
          }}>
            {product.name}
          </h3>
          
          <p style={{ 
            margin: '5px 0', 
            fontSize: '0.85rem', 
            color: '#666'
          }}>
            {product.type} - {product.category}
          </p>
        </div>
        
        <div>
          <p style={{ 
            margin: '10px 0 5px 0', 
            fontSize: '1.3rem', 
            fontWeight: 'bold',
            color: '#f3c332'
          }}>
            ${product.price.toFixed(2)}
          </p>

          {/* MOSTRAR STOCK ACTUAL */}
          <p style={{ 
            margin: '5px 0', 
            fontSize: '0.75rem', 
            color: currentStock > 10 ? 'green' : currentStock > 0 ? '#ff9800' : '#cc0000',
            fontWeight: 'bold'
          }}>
            {currentStock} unidades disponibles
          </p>
          
          <button 
            onClick={handleAddToCart}
            disabled={!isInStock || isAdding}
            style={{ 
              width: '100%',
              padding: '10px',
              backgroundColor: isInStock ? '#f3c332' : '#cccccc',
              color: isInStock ? '#cc0000' : '#666666',
              border: 'none',
              borderRadius: '6px',
              cursor: isInStock ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = '#e6b400';
              }
            }}
            onMouseLeave={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = '#f3c332';
              }
            }}
          >
            {isAdding ? 'Agregando...' : (isInStock ? 'Agregar al Carrito' : 'Sin Stock')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;