import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

const AdminPage: React.FC = () => {
  const { user, login, loginWithGoogle, logout, loading: authLoading } = useAuth();
  const { 
    products, 
    loading: productsLoading, 
    error, 
    deleteProduct, 
    updateProductStock, 
    addProduct, 
    updateProduct, 
    resetAllStock 
  } = useProducts();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'POCHOCLOS' as 'POCHOCLOS' | 'BEBIDA',
    type: '',
    price: 0,
    stock: 20,
    initialStock: 20,
    imagen: ''
  });
  
  // ESTADOS PARA EDITAR PRODUCTO
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'POCHOCLOS' as 'POCHOCLOS' | 'BEBIDA',
    type: '',
    price: 0,
    stock: 0,
    initialStock: 0,
    imagen: '',
    inStock: true
  });

  const ADMIN_EMAILS = ['matiassosa@iresm.edu.ar'];

  // FUNCIÓN PARA MANEJAR UPLOAD DE IMAGEN
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, imagen: imageUrl }));
        } else {
          setNewProduct(prev => ({ ...prev, imagen: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8efed'
      }}>
        <p style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Cargando sesión...</p>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await login(email, password);
    } catch (e: any) {
      setLoginError('Error al iniciar sesión. Verifica el email y la contraseña.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e: any) {
      setLoginError('Error al iniciar sesión con Google.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        alert('Producto eliminado exitosamente');
      } catch (e: any) {
        alert('Error al eliminar el producto: ' + e.message);
      }
    }
  };

  // FUNCIÓN ACTUALIZADA PARA REPONER STOCK
  const handleRestock = async (id: string, initialStock: number) => {
    try {
      await updateProductStock(id, initialStock);
      alert(`Stock repuesto a ${initialStock} unidades`);
    } catch (e: any) {
      alert('Error al reponer el stock: ' + e.message);
    }
  };

  // FUNCIÓN PARA ACTUALIZAR STOCK MANUALMENTE
  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) {
      alert('El stock no puede ser negativo');
      return;
    }
    
    try {
      await updateProductStock(id, newStock);
    } catch (e: any) {
      alert('Error al actualizar el stock: ' + e.message);
    }
  };

  // FUNCIÓN PARA ABRIR MODAL DE EDICIÓN
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category as 'POCHOCLOS' | 'BEBIDA',
      type: product.type,
      price: product.price,
      stock: product.stock || 0,
      initialStock: product.initialStock || 20,
      imagen: product.imagen || '',
      inStock: product.inStock !== undefined ? product.inStock : true
    });
    setShowEditModal(true);
  };

  // FUNCIÓN PARA ACTUALIZAR PRODUCTO
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      await updateProduct(editingProduct.id, {
        ...editFormData
      });
      alert(`Producto "${editFormData.name}" actualizado exitosamente!`);
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      alert('Error al actualizar el producto: ' + error.message);
    }
  };

  // FUNCIÓN MEJORADA PARA AGREGAR PRODUCTO
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!newProduct.name.trim()) {
      alert('Por favor ingresa un nombre para el producto');
      return;
    }
    
    if (newProduct.price <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    
    if (newProduct.stock < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    try {
      await addProduct({
        ...newProduct
      });
      
      // Resetear formulario
      setNewProduct({
        name: '',
        category: 'POCHOCLOS',
        type: '',
        price: 0,
        stock: 20,
        initialStock: 20,
        imagen: ''
      });
      
      alert('Producto agregado exitosamente!');
    } catch (e: any) {
      console.error('Error al agregar producto:', e);
      alert('Error al agregar el producto: ' + (e.message || 'Error desconocido'));
    }
  };

  // FUNCIÓN PARA REPONER TODO EL STOCK
  const handleRestockAll = async () => {
    if (window.confirm('¿Estás seguro de que quieres reponer todo el stock a 20 unidades?')) {
      try {
        await resetAllStock();
        alert('Todo el stock ha sido repuesto exitosamente!');
      } catch (e: any) {
        alert('Error al reponer el stock: ' + e.message);
      }
    }
  };

  const isAuthorized = user && ADMIN_EMAILS.includes(user.email!);

  if (user && isAuthorized) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8efed', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#cc0000', borderBottom: '2px solid #f3c332', paddingBottom: '10px' }}>
          Panel de Administración
        </h1>
        <p style={{ fontWeight: 'bold' }}><b>Bienvenido:</b> {user.email}</p>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: activeTab === 'inventory' ? '#cc0000' : '#f3c332', 
              color: activeTab === 'inventory' ? 'white' : '#cc0000',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Gestionar Inventario
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: activeTab === 'add' ? '#cc0000' : '#f3c332', 
              color: activeTab === 'add' ? 'white' : '#cc0000',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Agregar Producto
          </button>

          {/* BOTÓN PARA REPONER TODO EL STOCK */}
          <button 
            onClick={handleRestockAll}
            disabled={products.length === 0}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: products.length > 0 ? '#28a745' : '#ccc', 
              color: 'white',
              border: 'none', 
              borderRadius: '4px', 
              cursor: products.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            🔄 Reponer Todo el Stock
          </button>

          <button 
            onClick={logout}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#cc0000', 
              color: 'white', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        {activeTab === 'inventory' && (
          <>
            <h3>Inventario Actual</h3>
            {productsLoading && <p>Cargando inventario...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {products.length === 0 && !productsLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#555', fontSize: '1.1rem' }}>No hay productos en la base de datos.</p>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflowX: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#cc0000', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'center', width: '80px' }}>Imagen</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Categoría</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Precio</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Stock Actual</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Stock Inicial</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {products.map((product: Product) => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <img 
                            src={product.imagen || (product.category === 'POCHOCLOS' ? '/images/Pochoclos-Salados.png' : '/images/Jugo-Multifruta.png')} 
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #ddd'
                            }}
                          />
                        </td>
                        
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{product.name}</td>
                        <td style={{ padding: '10px' }}>{product.category}</td>
                        <td style={{ padding: '10px' }}>{product.type}</td>
                        <td style={{ padding: '10px' }}>${product.price?.toFixed(2)}</td>
                        
                        {/* COLUMNA DE STOCK ACTUAL */}
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <button 
                              onClick={() => handleUpdateStock(product.id, (product.stock || 0) - 1)}
                              style={{ 
                                padding: '2px 6px', 
                                backgroundColor: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '3px', 
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              -
                            </button>
                            
                            <span style={{ 
                              fontWeight: 'bold', 
                              color: (product.stock || 0) > 10 ? 'green' : (product.stock || 0) > 0 ? '#ff9800' : '#cc0000',
                              minWidth: '30px',
                              display: 'inline-block'
                            }}>
                              {product.stock || 0}
                            </span>
                            
                            <button 
                              onClick={() => handleUpdateStock(product.id, (product.stock || 0) + 1)}
                              style={{ 
                                padding: '2px 6px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '3px', 
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        
                        {/* COLUMNA DE STOCK INICIAL */}
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
                          {product.initialStock || 20}
                        </td>

                        {/* COLUMNA DE ESTADO */}
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: (product.stock || 0) > 0 ? 'green' : '#cc0000' }}>
                          {(product.stock || 0) > 0 ? 'En Stock' : 'Sin Stock'}
                        </td>

                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              style={{ 
                                padding: '6px 10px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                              }}
                            >
                              Editar
                            </button>
                            
                            <button 
                              onClick={() => handleRestock(product.id, product.initialStock || 20)}
                              style={{ 
                                padding: '6px 10px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                              }}
                            >
                              Reponer
                            </button>
                            
                            <button 
                              onClick={() => handleDelete(product.id)}
                              style={{ 
                                padding: '6px 10px', 
                                backgroundColor: '#cc0000', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'add' && (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#cc0000', marginBottom: '20px', borderBottom: '2px solid #f3c332', paddingBottom: '10px' }}>
              Agregar Nuevo Producto
            </h3>
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre:</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Ej: Pochoclos Dulces"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoría:</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value as 'POCHOCLOS' | 'BEBIDA'})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="POCHOCLOS">Pochoclos</option>
                  <option value="BEBIDA">Bebida</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tipo:</label>
                <input 
                  type="text" 
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Ej: Dulces, Salados, Caja de juguitos, etc."
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio:</label>
                <input 
                  type="number" 
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  required 
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="0.00"
                />
              </div>

              {/* CAMPOS PARA STOCK */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Stock Inicial:</label>
                <input 
                  type="number" 
                  value={newProduct.initialStock}
                  onChange={(e) => setNewProduct({
                    ...newProduct, 
                    initialStock: Number(e.target.value), 
                    stock: Number(e.target.value)
                  })}
                  required 
                  min="0"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              {/* CAMPO PARA IMAGEN */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Imagen del Producto:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                {newProduct.imagen && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '5px', fontWeight: 'bold' }}>Vista previa:</p>
                    <img 
                      src={newProduct.imagen} 
                      alt="Vista previa" 
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        border: '2px solid #f3c332'
                      }}
                    />
                  </div>
                )}
              </div>

              <button 
                type="submit"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: '#f3c332', 
                  color: '#cc0000', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '1.1em',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e6b400';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3c332';
                }}
              >
                Agregar Producto
              </button>
            </form>
          </div>
        )}

        {/* MODAL PARA EDITAR PRODUCTO */}
        {showEditModal && editingProduct && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: '#cc0000', marginBottom: '20px', borderBottom: '2px solid #f3c332', paddingBottom: '10px' }}>
                Editando: {editingProduct.name}
              </h3>
              
              {/* VISTA PREVIA DE LA IMAGEN ACTUAL */}
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Imagen actual:</p>
                <img 
                  src={editFormData.imagen || (editingProduct.category === 'POCHOCLOS' ? '/images/pochoclos-default.jpg' : '/images/bebida-default.jpg')} 
                  alt="Imagen actual"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }}
                />
              </div>
              
              <form onSubmit={handleUpdateProduct}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre:</label>
                  <input 
                    type="text" 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoría:</label>
                  <select 
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value as 'POCHOCLOS' | 'BEBIDA'})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="POCHOCLOS">Pochoclos</option>
                    <option value="BEBIDA">Bebida</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tipo:</label>
                  <input 
                    type="text" 
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="Ej: Dulces, Salados, Caja de juguitos, etc."
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio:</label>
                  <input 
                    type="number" 
                    value={editFormData.price || ''}
                    onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})}
                    required 
                    min="0"
                    step="0.01"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                {/* CAMPOS PARA STOCK EN EDICIÓN */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Stock Actual:</label>
                  <input 
                    type="number" 
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({...editFormData, stock: Number(e.target.value)})}
                    required 
                    min="0"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Stock Inicial (para reponer):</label>
                  <input 
                    type="number" 
                    value={editFormData.initialStock}
                    onChange={(e) => setEditFormData({...editFormData, initialStock: Number(e.target.value)})}
                    required 
                    min="0"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                {/* CAMPO PARA CAMBIAR IMAGEN */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Cambiar Imagen:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                  {editFormData.imagen && editFormData.imagen !== editingProduct.imagen && (
                    <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.8rem', marginBottom: '5px', fontWeight: 'bold' }}>Nueva imagen:</p>
                      <img 
                        src={editFormData.imagen} 
                        alt="Nueva imagen"
                        style={{
                          maxWidth: '150px',
                          maxHeight: '120px',
                          borderRadius: '6px',
                          border: '2px solid #4caf50'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="submit"
                    style={{ 
                      flex: 1,
                      padding: '12px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Cambios
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{ 
                      padding: '12px', 
                      backgroundColor: '#666', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user && !isAuthorized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f8efed',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          padding: '40px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#cc0000', marginBottom: '20px' }}>Acceso Denegado</h2>
          <p style={{ marginBottom: '20px' }}>No tienes permisos para acceder al panel de administración.</p>
          <button 
            onClick={logout}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#cc0000', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f8efed',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '90%', 
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#cc0000', textAlign: 'center', marginBottom: '30px' }}>Acceso Administrativo</h2>
        
        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#4285f4', 
            color: 'white', 
            fontWeight: 'bold', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Iniciar Sesión con Google
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>o</div>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          {loginError && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{loginError}</p>}

          <button 
            type="submit"
            style={{ width: '100%', padding: '12px', backgroundColor: '#f3c332', color: '#cc0000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em' }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;