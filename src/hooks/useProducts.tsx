import { useState, useEffect } from 'react';
import type { Product } from '../types';

// Datos iniciales con stock de 20
const initialProductsData: Product[] = [
  {
    id: '1',
    name: 'Pochoclos Miti Miti',
    price: 1500.00,
    type: 'Mitsui Dukes y Salados',
    category: 'POCHOCLOS',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '2',
    name: 'Vaso De Pritty',
    price: 150.00,
    type: 'Pritty',
    category: 'BEBIDA',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '3',
    name: 'Pochoclos Salados',
    price: 1500.00,
    type: 'Salados',
    category: 'POCHOCLOS',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '4',
    name: 'Pochoclos Dulces',
    price: 1500.00,
    type: 'Dulces',
    category: 'POCHOCLOS',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '5',
    name: 'Jugo de Durazno',
    price: 600.00,
    type: 'Baggio de Caja',
    category: 'BEBIDA',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '6',
    name: 'Vaso de Gaseosa',
    price: 150.00,
    type: 'Coca Cola',
    category: 'BEBIDA',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '7',
    name: 'Jugo Multifruta',
    price: 600.00,
    type: 'Baggio de Caja',
    category: 'BEBIDA',
    inStock: true,
    stock: 20,
    initialStock: 20
  },
  {
    id: '8',
    name: 'Jugo de Manzana',
    price: 600.00,
    type: 'Baggio de Caja',
    category: 'BEBIDA',
    inStock: true,
    stock: 20,
    initialStock: 20
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos al inicializar
  useEffect(() => {
    const loadProducts = () => {
      try {
        setLoading(true);
        
        // Intentar cargar desde localStorage
        const savedProducts = localStorage.getItem('products');
        const savedStock = localStorage.getItem('product-stock');
        
        if (savedProducts && savedStock) {
          // Si hay datos guardados, usarlos
          const parsedProducts = JSON.parse(savedProducts);
          const stockData = JSON.parse(savedStock);
          
          const productsWithStock = parsedProducts.map((product: Product) => ({
            ...product,
            stock: stockData[product.id] || product.stock || 20,
            initialStock: product.initialStock || 20,
            inStock: (stockData[product.id] || product.stock || 20) > 0
          }));
          
          setProducts(productsWithStock);
        } else {
          // Si no hay datos guardados, usar los datos iniciales con stock 20
          setProducts(initialProductsData);
          // Guardar en localStorage
          localStorage.setItem('products', JSON.stringify(initialProductsData));
          
          // Inicializar stock en localStorage
          const initialStockData: { [key: string]: number } = {};
          initialProductsData.forEach(product => {
            initialStockData[product.id] = 20;
          });
          localStorage.setItem('product-stock', JSON.stringify(initialStockData));
        }
        
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Guardar productos cuando cambien
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { 
                ...product, 
                stock: newStock, 
                inStock: newStock > 0 
              }
            : product
        )
      );

      // Actualizar en localStorage
      const stockData = JSON.parse(localStorage.getItem('product-stock') || '{}');
      stockData[productId] = newStock;
      localStorage.setItem('product-stock', JSON.stringify(stockData));

    } catch (err) {
      setError('Error al actualizar el stock');
      throw err;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'inStock'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        inStock: (productData.stock || 0) > 0
      };

      setProducts(prev => [...prev, newProduct]);

      // Actualizar stock en localStorage
      const stockData = JSON.parse(localStorage.getItem('product-stock') || '{}');
      stockData[newProduct.id] = newProduct.stock;
      localStorage.setItem('product-stock', JSON.stringify(stockData));

    } catch (err) {
      setError('Error al agregar el producto');
      throw err;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { 
                ...product, 
                ...productData,
                inStock: (productData.stock !== undefined ? productData.stock : product.stock) > 0
              }
            : product
        )
      );

      // Actualizar stock en localStorage si se modificó
      if (productData.stock !== undefined) {
        const stockData = JSON.parse(localStorage.getItem('product-stock') || '{}');
        stockData[productId] = productData.stock;
        localStorage.setItem('product-stock', JSON.stringify(stockData));
      }

    } catch (err) {
      setError('Error al actualizar el producto');
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setProducts(prev => prev.filter(product => product.id !== productId));

      // Eliminar del localStorage de stock
      const stockData = JSON.parse(localStorage.getItem('product-stock') || '{}');
      delete stockData[productId];
      localStorage.setItem('product-stock', JSON.stringify(stockData));

    } catch (err) {
      setError('Error al eliminar el producto');
      throw err;
    }
  };

  // Función para resetear todo el stock a 20
  const resetAllStock = async () => {
    try {
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          stock: product.initialStock || 20,
          inStock: true
        }))
      );

      // Resetear stock en localStorage
      const stockData: { [key: string]: number } = {};
      products.forEach(product => {
        stockData[product.id] = product.initialStock || 20;
      });
      localStorage.setItem('product-stock', JSON.stringify(stockData));

    } catch (err) {
      setError('Error al resetear el stock');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    resetAllStock // Nueva función
  };
};