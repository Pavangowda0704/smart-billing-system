export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  weight: number; // in grams
  barcode: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    totalAmount: number;
}