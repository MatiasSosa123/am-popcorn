import { useState, useEffect } from 'react';
import type { Product } from '../types';

export const useStock = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar stock desde localStorage al inicializar - MODIFICADO
  useEffect(() => {
    const savedStock = localStorage.getItem('product-stock');
    const stockInitialized = localStorage.getItem('stock-initialized');
    
    if (savedStock && stockInitialized) {
      // Si ya hay stock guardado y fue inicializado, usarlo
      const stockData = JSON.parse(savedStock);
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          stock: stockData[product.id] || product.stock || 20,
          inStock: (stockData[product.id] || product.stock || 20) > 0
        }))
      );
    } else {
      // Si es la primera vez, forzar 20 unidades para todos
      setProducts(initialProducts.map(product => ({
        ...product,
        stock: 20,
        initialStock: 20,
        inStock: true
      })));
      
      // Guardar en localStorage
      const initialStockData: { [key: string]: number } = {};
      initialProducts.forEach(product => {
        initialStockData[product.id] = 20;
      });
      localStorage.setItem('product-stock', JSON.stringify(initialStockData));
      localStorage.setItem('stock-initialized', 'true');
    }
  }, []);

  // Actualizar productos cuando initialProducts cambie
  useEffect(() => {
    if (products.length === 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Actualizar stock de un producto
  const updateStock = (productId: string, newStock: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock, inStock: newStock > 0 }
          : product
      )
    );

    // Guardar en localStorage
    const stockData = JSON.parse(localStorage.getItem('product-stock') || '{}');
    stockData[productId] = newStock;
    localStorage.setItem('product-stock', JSON.stringify(stockData));
  };

  // Reponer stock al valor inicial - MODIFICADO para siempre usar 20
  const restockAll = () => {
    setProducts(prevProducts => 
      prevProducts.map(product => ({
        ...product,
        stock: 20, // Siempre reponer a 20
        initialStock: 20, // También actualizar el stock inicial
        inStock: true
      }))
    );

    // Actualizar localStorage
    const stockData: { [key: string]: number } = {};
    products.forEach(product => {
      stockData[product.id] = 20; // Siempre 20
    });
    localStorage.setItem('product-stock', JSON.stringify(stockData));
  };

  // Reponer un producto específico
  const restockProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateStock(productId, 20); // Siempre reponer a 20
    }
  };

  return {
    products,
    updateStock,
    restockAll,
    restockProduct
  };
};