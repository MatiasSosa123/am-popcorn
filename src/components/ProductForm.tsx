import React, { useState } from 'react';

const ProductForm: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Guardando...');

        if (!name || price <= 0 || !category) {
            setStatus('Error: Todos los campos son requeridos.');
            return;
        }

        try {
            setStatus('Producto agregado con éxito!');
            setName('');
            setPrice(0);
            setCategory('');
        } catch (error) {
            setStatus('Error al guardar el producto.');
        }
    };

    return (
        <div style={{ /* Estilos de la caja */ }}>
            <h4>Agregar Nuevo Producto</h4>
            <form onSubmit={handleSubmit}>
                <button type="submit">Guardar Producto</button>
                <p>{status}</p>
            </form>
        </div>
    );
};

export default ProductForm;