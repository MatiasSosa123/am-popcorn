import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot,
  setDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types';

// Datos iniciales de productos
const initialProducts: Product[] = [
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

// Función para inicializar productos en Firebase
export const initializeProducts = async (): Promise<void> => {
  try {
    const productsRef = collection(db, 'products');
    
    // Verificar si ya existen productos
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log('Inicializando productos en Firebase...');
      
      // Crear todos los productos
      const initializePromises = initialProducts.map(async (product) => {
        const productRef = doc(productsRef, product.id);
        await setDoc(productRef, product);
        console.log(`Producto ${product.id} creado: ${product.name}`);
      });
      
      await Promise.all(initializePromises);
      console.log('Todos los productos inicializados en Firebase');
    } else {
      console.log('Los productos ya existen en Firebase');
    }
  } catch (error) {
    console.error('Error inicializando productos:', error);
    throw error;
  }
};

// Función para obtener stock actual
export const getCurrentStock = async (productId: string): Promise<number> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const productData = productDoc.data();
      return productData.stock || 0;
    } else {
      console.warn(`Producto ${productId} no encontrado en Firebase`);
      // Si el producto no existe, crearlo con stock inicial
      await initializeProductIfMissing(productId);
      return 20; // Stock por defecto
    }
  } catch (error) {
    console.error('Error getting current stock:', error);
    throw error;
  }
};

// Función para crear un producto si no existe
const initializeProductIfMissing = async (productId: string): Promise<void> => {
  try {
    const product = initialProducts.find(p => p.id === productId);
    if (product) {
      const productsRef = collection(db, 'products');
      const productRef = doc(productsRef, productId);
      await setDoc(productRef, product);
      console.log(`Producto ${productId} creado automáticamente`);
    }
  } catch (error) {
    console.error('Error creando producto:', error);
  }
};

// Función para actualizar stock
export const updateStock = async (productId: string, newStock: number) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      // Si el producto no existe, crearlo primero
      await initializeProductIfMissing(productId);
    }
    
    await updateDoc(doc(db, 'products', productId), {
      stock: newStock,
      inStock: newStock > 0,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

// Hook principal
export const useRealTimeStock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Inicializar productos y escuchar cambios en tiempo real
  useEffect(() => {
    const setupProducts = async () => {
      try {
        // Inicializar productos si no existen
        await initializeProducts();
        
        // Escuchar cambios en tiempo real
        const productsRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
          const productsData: Product[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            productsData.push({ 
              id: doc.id, 
              ...data,
              stock: data.stock || 20,
              initialStock: data.initialStock || 20,
              inStock: (data.stock || 20) > 0
            } as Product);
          });
          
          // Ordenar por ID para mantener consistencia
          productsData.sort((a, b) => a.id.localeCompare(b.id));
          setProducts(productsData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up products:', error);
        setLoading(false);
      }
    };

    const unsubscribePromise = setupProducts();

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  // Reponer todo el stock a 20 unidades
  const restockAll = async () => {
    try {
      const updatePromises = products.map(product => 
        updateDoc(doc(db, 'products', product.id), {
          stock: 20,
          initialStock: 20,
          inStock: true,
          lastUpdated: new Date()
        })
      );
      await Promise.all(updatePromises);
      console.log('Todo el stock repuesto a 20 unidades');
    } catch (error) {
      console.error('Error restocking all:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    updateStock,
    restockAll,
    getCurrentStock
  };
};