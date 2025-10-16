import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartDisplay: React.FC = () => {
  const { items, total, removeItem, clearCart } = useCart(); 
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const baseButtonStyle = {
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginLeft: '5px',
    fontWeight: 'bold',
  };
  
  const primaryButtonStyle = {
      ...baseButtonStyle,
      width: '100%',
      marginTop: '15px',
      backgroundColor: '#f3c332', 
      color: '#cc0000', 
      fontSize: '1.1em',
  };
  
  const secondaryButtonStyle = {
      ...baseButtonStyle,
      width: '100%',
      marginTop: '10px',
      backgroundColor: '#cc0000',
      color: 'white',
      fontSize: '0.9em',
      padding: '8px 10px'
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: '#000000ff',
          color: 'white', 
          border: 'none', 
          padding: '12px 18px', 
          borderRadius: '25px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)' 
        }}
      >
        <span style={{ fontSize: '1.2em' }}>🛒</span> 
        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
            ({totalItems})
        </span>
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          right: '0', 
          top: '60px', 
          width: '320px', 
          backgroundColor: 'white', 
          border: '1px solid #cc0000', 
          padding: '15px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          borderRadius: '8px'
        }}>
          <h4>Tu Carrito</h4>
          
          {items.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map(item => (
                  <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px dotted #ccc' }}>
                    
                    <span style={{ flexGrow: 1 }}>{item.name}</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>x {item.quantity}</span>


                        {/* Agregar BOTON DE INCREMENTO UNA UNIDAD */}

                        
                        <button 
                            onClick={() => removeItem(item.id)}
                            style={{ ...baseButtonStyle, backgroundColor: '#cc0000', color: 'white' }} 
                            title="Remover 1 unidad"
                        >
                            -
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <hr />
              <p style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'right' }}>
                  Total: ${total.toFixed(2)}
              </p>

              <button
                  onClick={clearCart} 
                  style={secondaryButtonStyle}
              >
                  Vaciar Carrito Completo
              </button>

              {/* Botón Finalizar Compra */}
              <button
                  style={primaryButtonStyle}
              >
                  Finalizar Compra
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDisplay;