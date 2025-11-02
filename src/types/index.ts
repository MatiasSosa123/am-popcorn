export interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
  category: 'POCHOCLOS' | 'BEBIDA';
  imagen?: string;
  inStock: boolean;
  stock: number;
  initialStock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  name: string;
  price: number;
}

export interface DiscountRule {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  discount: number;
  discountCode: string | null;
}

export interface CartContextType extends CartState {
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