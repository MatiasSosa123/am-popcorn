import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
// import ProductForm from '../components/ProductForm'; // Se usará para agregar/editar (Paso siguiente)

const AdminPage: React.FC = () => {
  const { user, login, logout, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, error, deleteProduct } = useProducts(); // <-- Usamos el hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const ADMIN_EMAIL = 'matias.sosa.bonaventura@gmail.com'; 

  if (authLoading) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Cargando...</p>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await login(email, password);
    } catch (e: any) {
      setLoginError('Error al iniciar sesión. Verifica el email y la contraseña de administrador.');
    }
  };
  
  const handleDelete = async (id: number | string) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
          try {
              await deleteProduct(id);
          } catch (e) {
              alert('Fallo la eliminación del producto. Inténtalo de nuevo.');
          }
      }
  }

  if (user && user.email === ADMIN_EMAIL) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8efed', minHeight: '80vh' }}>
        <h2 style={{ color: '#cc0000', borderBottom: '2px solid #f3c332', paddingBottom: '10px' }}>
            Panel de Administración 🛠️
        </h2>
        
        <p>Bienvenido, **{user.email}**.</p>
        
        {/* Aquí iría ProductForm para AGREGAR/EDITAR (Próximo paso) */}
        <div style={{ padding: '20px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', marginBottom: '30px' }}>
            <h3>Agregar Nuevo Producto (PENDIENTE)</h3>
        </div>

        <h3>Inventario Actual</h3>
        {productsLoading && <p>Cargando inventario...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
                <tr style={{ backgroundColor: '#cc0000', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>ID (Firestore)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Precio</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 && !productsLoading && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '15px' }}>No hay productos en la base de datos.</td></tr>
                )}
                {products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{product.id}</td>
                        <td style={{ padding: '10px' }}>{product.name}</td>
                        <td style={{ padding: '10px' }}>${product.price.toFixed(2)}</td>
                        <td style={{ padding: '10px' }}>
                            <button 
                                onClick={() => handleDelete(product.id)}
                                style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#cc0000', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Eliminar
                            </button>
                            {/* Botón Editar iría aquí */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <button 
          onClick={logout}
          style={{ padding: '10px', backgroundColor: '#cc0000', color: 'white', marginTop: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '50px auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <h2 style={{ color: '#cc0000', textAlign: 'center' }}>Acceso de Administrador</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc' }}
          />
        </div>
        
        {loginError && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{loginError}</p>}

        <button 
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#f3c332', color: '#cc0000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Iniciar Sesión
        </button>
      </form>
      <p style={{ marginTop: '20px', fontSize: '0.8em', textAlign: 'center', color: '#555' }}>
        Cuenta de ejemplo: {ADMIN_EMAIL} / Contraseña: Matias120108
      </p>
    </div>
  );
};

export default AdminPage;