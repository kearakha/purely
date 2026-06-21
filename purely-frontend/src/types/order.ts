import { Product } from './product';

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'canceled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type PaymentMethod = 'cod' | 'transfer' | 'ewallet';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  status_label: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address: string;
  delivery_notes?: string;
  delivery_fee: number;
  estimated_delivery?: string;
  delivered_at?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface CreateOrderPayload {
  delivery_address: string;
  delivery_notes?: string;
  payment_method: PaymentMethod;
}

export interface OrderFilters {
  status?: OrderStatus;
  per_page?: number;
  page?: number;
}