import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDisplay: React.FC = () => {
  const { 
    items, 
    total, 
    discount, 
    subtotal, 
    discountCode,
    removeItem, 
    updateItemQuantity, 
    clearCart, 
    applyDiscount,
    removeDiscount,
    isValidDiscountCode
  } = useCart();
  
  const navigate = useNavigate();
  const [discountInput, setDiscountInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    
    setIsApplyingDiscount(true);
    try {
      if (isValidDiscountCode(discountInput)) {
        applyDiscount(discountInput);
        setDiscountInput('');
      } else {
        alert('Código de descuento inválido');
      }
    } catch (error) {
      alert('Error al aplicar el descuento');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const copyAliasToClipboard = () => {
    navigator.clipboard.writeText('Matias-Sosa.NX')
      .then(() => {
        setCopiedAlias(true);
        setTimeout(() => setCopiedAlias(false), 3000);
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
        alert('Error al copiar el alias');
      });
  };

  const generateWhatsAppMessage = (paymentMethod: 'transferencia' | 'efectivo') => {
    const itemsText = items.map(item => 
      `${item.product.name} - ${item.quantity} x $${item.product.price} = $${(item.quantity * item.product.price).toFixed(2)}`
    ).join('%0A');

    const discountText = discount > 0 ? 
      `%0A%0A🎁 *Descuento aplicado:* ${discountCode}%0A💰 *Ahorro:* $${discount.toFixed(2)}` : '';

    const paymentMethodText = paymentMethod === 'transferencia' ? 
      '💳 *Método de pago:* Transferencia bancaria' : 
      '💵 *Método de pago:* Efectivo';

    const message = `¡Hola! Quiero confirmar mi pedido:%0A%0A🛒 *Productos:*%0A${itemsText}${discountText}%0A%0A📦 *Total:* $${total.toFixed(2)}%0A${paymentMethodText}%0A%0A👤 *Mi nombre es:* [ESCRIBE TU NOMBRE AQUÍ]`;

    return message;
  };

  const openWhatsApp = (paymentMethod: 'transferencia' | 'efectivo') => {
    const message = generateWhatsAppMessage(paymentMethod);
    const phoneNumber = '+543541570024';
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateItemQuantity(productId, newQuantity);
    } catch (error: any) {
      alert(error.message || 'Error al actualizar la cantidad');
    }
  };

  const handleFinalizeTransfer = () => {
    openWhatsApp('transferencia');
  };

  const handleCashPayment = () => {
    openWhatsApp('efectivo');
  };

  if (items.length === 0) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        backgroundColor: '#f8efed',
        minHeight: '60vh'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>🛒 Carrito Vacío</h2>
          <p style={{ marginBottom: '30px', color: '#666', fontSize: '1.1rem' }}>
            No hay productos en tu carrito
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#f3c332',
              color: '#cc0000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6b400';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3c332';
            }}
          >
            Ir a Comprar 🍿
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8efed',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#cc0000', 
          textAlign: 'center', 
          marginBottom: '30px',
          borderBottom: '2px solid #f3c332',
          paddingBottom: '10px'
        }}>
          🛒 Tu Carrito de Compras
        </h1>

        {/* LISTA DE PRODUCTOS */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#cc0000', marginBottom: '20px' }}>
            Productos ({items.reduce((total, item) => total + item.quantity, 0)} items)
          </h3>
          
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
              }}
            >
              {/* Imagen del producto */}
              <div style={{ marginRight: '15px' }}>
                <img 
                  src={item.product.imagen || (item.product.category === 'POCHOCLOS' ? '/images/Pochoclos-Salados.png' : '/images/Jugo-Multifruta.png' )}
                  alt={item.product.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '2px solid #f3c332'
                  }}
                />
              </div>

              {/* Información del producto */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  margin: '0 0 5px 0', 
                  color: '#cc0000',
                  fontSize: '1.1rem'
                }}>
                  {item.product.name}
                </h4>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  {item.product.type} - {item.product.category}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontWeight: 'bold',
                  color: '#f3c332',
                  fontSize: '1.1rem'
                }}>
                  ${item.product.price.toFixed(2)} c/u
                </p>
              </div>

              {/* Controles de cantidad */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginRight: '20px'
              }}>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: item.quantity <= 1 ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  -
                </button>
                
                <span style={{ 
                  fontWeight: 'bold',
                  minWidth: '30px',
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: item.quantity >= item.product.stock ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal y eliminar */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#cc0000'
                }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#cc0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CUPÓN DE DESCUENTO */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#cc0000', marginBottom: '15px' }}>Cupón de Descuento</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="Ingresa tu código de descuento"
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleApplyDiscount();
              }}
            />
            <button
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount || !discountInput.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: isApplyingDiscount || !discountInput.trim() ? '#ccc' : '#f3c332',
                color: isApplyingDiscount || !discountInput.trim() ? '#666' : '#cc0000',
                border: 'none',
                borderRadius: '6px',
                cursor: isApplyingDiscount || !discountInput.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {isApplyingDiscount ? 'Aplicando...' : 'Aplicar'}
            </button>
          </div>
          
          {discountCode && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#e8f5e8',
              borderRadius: '6px',
              border: '1px solid #4caf50'
            }}>
              <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
                ✅ Código aplicado: {discountCode}
                <button
                  onClick={removeDiscount}
                  style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    backgroundColor: 'transparent',
                    color: '#cc0000',
                    border: '1px solid #cc0000',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Quitar
                </button>
              </p>
            </div>
          )}
        </div>

        {/* RESUMEN DE COMPRA */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#cc0000', marginBottom: '20px', textAlign: 'center' }}>
            Resumen de Compra
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                color: '#28a745'
              }}>
                <span>Descuento ({discountCode}):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '2px solid #f3c332',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#cc0000'
            }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            marginTop: '25px',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Seguir Comprando
              </button>
              
              <button
                onClick={clearCart}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Vaciar Carrito
              </button>
            </div>

            {/* BOTÓN PARA MOSTRAR MÉTODOS DE PAGO */}
            {!showPaymentMethods ? (
              <button
                onClick={() => setShowPaymentMethods(true)}
                style={{
                  padding: '15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Proceder al Pago - ${total.toFixed(2)}
              </button>
            ) : (
              <div style={{
                border: '2px solid #f3c332',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff9e6'
              }}>
                <h3 style={{ color: '#cc0000', marginBottom: '15px', textAlign: 'center' }}>
                  <b><u>Selecciona Método de Pago</u></b>
                </h3>
                
                {/* PAGO POR TRANSFERENCIA */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#cc0000', marginBottom: '10px' }}> Transferencia Bancaria</h4>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                  }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                      Alias: Matias-Sosa.NX
                    </p>
                    <button
                      onClick={copyAliasToClipboard}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      {copiedAlias ? 'Copiado !' : 'Copiar Alias'}
                    </button>
                    <small style={{ color: '#666' }}>
                      Realiza la transferencia y luego confirma tu compra
                    </small>
                  </div>
                  <button
                    onClick={handleFinalizeTransfer}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      marginTop: '10px'
                    }}
                  >
                    Finalizar Compra (Transferencia)
                  </button>
                </div>

                {/* PAGO EN EFECTIVO */}
                <div>
                  <h4 style={{ color: '#cc0000', marginBottom: '10px' }}>Pago en Efectivo</h4>
                  <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                    Podrás abonar en efectivo al momento de la entrega
                  </p>
                  <button
                    onClick={handleCashPayment}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#f3c332',
                      color: '#cc0000',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Pagar en Efectivo
                  </button>
                </div>

                <button
                  onClick={() => setShowPaymentMethods(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: '#666',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '15px'
                  }}
                >
                  ← Volver atrás
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;