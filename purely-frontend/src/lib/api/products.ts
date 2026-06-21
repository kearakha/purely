import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Category, Product, ProductFilters } from "@/types/product";
import apiClient from "./client";

const DEMO_CATEGORIES: Category[] = [
  { id: 1, name: "Sayuran", slug: "sayuran", icon: "🥦", is_active: true },
  { id: 2, name: "Buah-buahan", slug: "buah", icon: "🍎", is_active: true },
  {
    id: 3,
    name: "Daging & Ikan",
    slug: "daging-ikan",
    icon: "🥩",
    is_active: true,
  },
  {
    id: 4,
    name: "Susu & Telur",
    slug: "susu-telur",
    icon: "🥛",
    is_active: true,
  },
  { id: 5, name: "Bumbu & Rempah", slug: "bumbu", icon: "🧄", is_active: true },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Brokoli Segar",
    slug: "brokoli-segar",
    description: "Brokoli segar pilihan dari petani lokal",
    price: 12000,
    stock: 50,
    unit: "ikat",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[0],
    seller: { id: 1, name: "Toko Sayur Pak Budi" },
    created_at: "2026-01-01",
  },
  {
    id: 2,
    name: "Bayam Hijau",
    slug: "bayam-hijau",
    description: "Bayam hijau organik tanpa pestisida",
    price: 5000,
    stock: 100,
    unit: "ikat",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[0],
    seller: { id: 1, name: "Toko Sayur Pak Budi" },
    created_at: "2026-01-01",
  },
  {
    id: 3,
    name: "Wortel Premium",
    slug: "wortel-premium",
    description: "Wortel besar manis dari Dieng",
    price: 8000,
    stock: 75,
    unit: "kg",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[0],
    seller: { id: 2, name: "Kebun Segar" },
    created_at: "2026-01-01",
  },
  {
    id: 4,
    name: "Apel Fuji",
    slug: "apel-fuji",
    description: "Apel Fuji import segar dan manis",
    price: 35000,
    stock: 30,
    unit: "kg",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[1],
    seller: { id: 2, name: "Kebun Segar" },
    created_at: "2026-01-01",
  },
  {
    id: 5,
    name: "Pisang Cavendish",
    slug: "pisang-cavendish",
    description: "Pisang cavendish manis dan legit",
    price: 18000,
    stock: 60,
    unit: "sisir",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[1],
    seller: { id: 1, name: "Toko Sayur Pak Budi" },
    created_at: "2026-01-01",
  },
  {
    id: 6,
    name: "Ayam Kampung",
    slug: "ayam-kampung",
    description: "Ayam kampung segar potong bersih",
    price: 65000,
    stock: 20,
    unit: "ekor",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[2],
    seller: { id: 3, name: "Peternakan Maju" },
    created_at: "2026-01-01",
  },
  {
    id: 7,
    name: "Ikan Salmon",
    slug: "ikan-salmon",
    description: "Salmon fillet segar import Norwegia",
    price: 120000,
    stock: 15,
    unit: "500g",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[2],
    seller: { id: 3, name: "Peternakan Maju" },
    created_at: "2026-01-01",
  },
  {
    id: 8,
    name: "Telur Ayam Kampung",
    slug: "telur-kampung",
    description: "Telur ayam kampung omega-3 tinggi",
    price: 30000,
    stock: 200,
    unit: "10 butir",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[3],
    seller: { id: 3, name: "Peternakan Maju" },
    created_at: "2026-01-01",
  },
  {
    id: 9,
    name: "Susu Full Cream",
    slug: "susu-full-cream",
    description: "Susu sapi full cream segar 1 liter",
    price: 22000,
    stock: 40,
    unit: "liter",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[3],
    seller: { id: 3, name: "Peternakan Maju" },
    created_at: "2026-01-01",
  },
  {
    id: 10,
    name: "Bawang Putih",
    slug: "bawang-putih",
    description: "Bawang putih lokal kualitas terbaik",
    price: 25000,
    stock: 80,
    unit: "kg",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[4],
    seller: { id: 2, name: "Kebun Segar" },
    created_at: "2026-01-01",
  },
  {
    id: 11,
    name: "Cabai Merah",
    slug: "cabai-merah",
    description: "Cabai merah keriting pedas segar",
    price: 40000,
    stock: 35,
    unit: "kg",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[4],
    seller: { id: 2, name: "Kebun Segar" },
    created_at: "2026-01-01",
  },
  {
    id: 12,
    name: "Tomat Beef",
    slug: "tomat-beef",
    description: "Tomat beef besar merah segar",
    price: 15000,
    stock: 60,
    unit: "kg",
    in_stock: true,
    is_active: true,
    category: DEMO_CATEGORIES[0],
    seller: { id: 1, name: "Toko Sayur Pak Budi" },
    created_at: "2026-01-01",
  },
];

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(
        "/products",
        { params: filters },
      );
      return response.data;
    } catch {
      let data = DEMO_PRODUCTS;
      if (filters?.category_id)
        data = data.filter((p) => p.category?.id === filters.category_id);
      if (filters?.search)
        data = data.filter((p) =>
          p.name.toLowerCase().includes(filters.search!.toLowerCase()),
        );
      return {
        data,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: data.length,
        },
      };
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${id}`,
      );
      return response.data.data;
    } catch {
      const product = DEMO_PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response =
        await apiClient.get<ApiResponse<Category[]>>("/categories");
      return response.data.data;
    } catch {
      return DEMO_CATEGORIES;
    }
  },
};
