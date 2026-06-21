export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  image_url?: string;
  in_stock: boolean;
  is_active: boolean;
  category?: Category;
  seller?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  per_page?: number;
  page?: number;
}