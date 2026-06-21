import { Product } from './product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}