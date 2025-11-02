import React, { createContext, useReducer, useContext } from 'react';
import type { ReactNode } from 'react';
import { updateStock } from '../hooks/useRealTimeStock';
import type { Product, CartItem, CartState, DiscountRule } from '../types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: string }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_ITEMS'; payload: CartItem[] };

// Definir tus códigos de descuento
const DISCOUNT_RULES: DiscountRule[] = [
  { code: 'POPCORN10', type: 'percentage', value: 10 },
  { code: 'AMPOPCORN', type: 'percentage', value: 15 },
  { code: 'PRIMERA-COMPRA', type: 'percentage', value: 35 },
];

const initialState: CartState = {
  items: [],
  total: 0,
  discount: 0,
  discountCode: null,
  subtotal: 0,
};

// Función para calcular descuentos
const calculateDiscount = (subtotal: number, discountCode: string | null): number => {
  if (!discountCode) return 0;
  
  const rule = DISCOUNT_RULES.find(rule => 
    rule.code.toLowerCase() === discountCode.toLowerCase()
  );
  
  if (!rule) return 0;
  
  if (rule.minAmount && subtotal < rule.minAmount) return 0;
  
  if (rule.type === 'percentage') {
    return (subtotal * rule.value) / 100;
  } else {
    return Math.min(rule.value, subtotal);
  }
};

// Función para calcular totales
const calculateTotals = (items: CartItem[], discountCode: string | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal, discountCode);
  const total = Math.max(0, subtotal - discount);

  return { subtotal, discount, total };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let updatedItems: CartItem[] = state.items;
  let discountCode = state.discountCode;

  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const productId = product.id.toString();
      const existingItem = state.items.find(item => item.id === productId);
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === productId 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                product: product
              } 
            : item
        );
      } else {
        updatedItems = [...state.items, { 
          id: productId,
          product: product,
          quantity: 1,
          name: product.name,
          price: product.price
        }];
      }
      break;
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      updatedItems = state.items.filter(item => item.id !== productId);
      break;
    }

    case 'UPDATE_ITEM_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        updatedItems = state.items.filter(item => item.id !== productId);
      } else {
        updatedItems = state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
      }
      break;
    }

    case 'SET_ITEMS': {
      updatedItems = action.payload;
      break;
    }

    case 'APPLY_DISCOUNT': {
      const code = action.payload;
      const rule = DISCOUNT_RULES.find(rule => 
        rule.code.toLowerCase() === code.toLowerCase()
      );
      
      if (rule) {
        discountCode = code;
      }
      break;
    }

    case 'REMOVE_DISCOUNT': {
      discountCode = null;
      break;
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
  
  const { subtotal, discount, total } = calculateTotals(updatedItems, discountCode);

  return { 
    items: updatedItems, 
    subtotal,
    total,
    discount,
    discountCode
  };
};

interface CartContextType extends CartState {
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  isValidDiscountCode: (code: string) => boolean;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = async (product: Product) => {
    try {
      // 1. Verificar stock localmente (ya viene verificado del ProductCard)
      if (product.stock <= 0) {
        throw new Error('Producto sin stock disponible');
      }

      // 2. Actualizar el stock en Firebase
      await updateStock(product.id, product.stock - 1);

      // 3. Crear una copia actualizada del producto con el nuevo stock
      const updatedProduct = {
        ...product,
        stock: product.stock - 1,
        inStock: (product.stock - 1) > 0
      };

      // 4. Agregar al carrito con los datos actualizados
      dispatch({ type: 'ADD_ITEM', payload: updatedProduct });
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('No se pudo agregar el producto al carrito. Intenta nuevamente.');
      }
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    const currentItem = state.items.find(item => item.id === productId);
    
    if (!currentItem) return;

    const stockDifference = quantity - currentItem.quantity;
    
    if (stockDifference === 0) return;

    try {
      // Verificar si hay suficiente stock localmente
      if (stockDifference > 0 && currentItem.product.stock < stockDifference) {
        throw new Error(`No hay suficiente stock disponible. Stock actual: ${currentItem.product.stock}`);
      }

      // Actualizar stock en Firebase
      await updateStock(productId, currentItem.product.stock - stockDifference);

      // Actualizar el producto en el carrito con stock actualizado
      const updatedProduct = {
        ...currentItem.product,
        stock: currentItem.product.stock - stockDifference,
        inStock: (currentItem.product.stock - stockDifference) > 0
      };

      // Actualizar la cantidad en el carrito
      const updatedItems = state.items.map(item =>
        item.id === productId 
          ? { ...item, quantity, product: updatedProduct }
          : item
      );

      dispatch({ type: 'SET_ITEMS', payload: updatedItems });
      
    } catch (error) {
      console.error('Error updating item quantity:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('No se pudo actualizar la cantidad. Intenta nuevamente.');
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyDiscount = (code: string) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: code });
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const isValidDiscountCode = (code: string): boolean => {
    return DISCOUNT_RULES.some(rule => 
      rule.code.toLowerCase() === code.toLowerCase()
    );
  };

  // Función para finalizar la compra
  const checkout = async (): Promise<void> => {
    if (state.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    try {
      // Verificar stock antes de procesar la compra
      for (const item of state.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`No hay suficiente stock de ${item.product.name}. Stock disponible: ${item.product.stock}`);
        }
      }

      // Actualizar stock para todos los items
      const updatePromises = state.items.map(item =>
        updateStock(item.product.id, item.product.stock - item.quantity)
      );

      await Promise.all(updatePromises);
      
      // Limpiar carrito después de compra exitosa
      dispatch({ type: 'CLEAR_CART' });
      
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error al procesar la compra');
      }
    }
  };

  return (
  <CartContext.Provider value={{ 
    items: state.items, 
    total: state.total,
    discount: state.discount,
    discountCode: state.discountCode,
    subtotal: state.subtotal,
    addItem, 
    removeItem, 
    updateItemQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    getItemQuantity,
    getTotalItems,
    isValidDiscountCode,
    checkout
  }}>
    {children}
  </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};