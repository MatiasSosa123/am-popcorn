export interface Product {
  id: number;
  name: string;
  category: 'POCHOCLOS' | 'BEBIDA';
  type: 'Dulces' | 'Salados' | 'Miti Miti' | 'Caja de juguitos' | 'Vasos de gaseosas';
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}