import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Product } from '../types';

interface ProductHook {
  products: Product[];
  loading: boolean;
  error: string | null;
  deleteProduct: (id: number) => Promise<void>;
}

const PRODUCTS_COLLECTION = 'products'; 

export const useProducts = (): ProductHook => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Carga de datos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      
      const fetchedProducts: Product[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string, 
          category: data.category as 'POCHOCLOS' | 'BEBIDA',
          type: data.type as 'Dulces' | 'Salados' | 'Miti Miti' | 'Caja de juguitos' | 'Vasos de gaseosas',
          price: data.price as number, 
        } as Product;
      });
      
      setProducts(fetchedProducts);
      setError(null);
    } catch (e: any) {
      console.error("Error al obtener productos:", e);
      setError("No se pudieron cargar los productos desde la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  //Eliminar un producto
  const deleteProduct = async (productId: number | string) => {
    try {

      await deleteDoc(doc(db, PRODUCTS_COLLECTION, String(productId)));
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      setError(null);
    } catch (e: any) {
      console.error("Error al eliminar producto:", e);
      setError("Error al eliminar el producto.");
      throw e;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, deleteProduct };
};