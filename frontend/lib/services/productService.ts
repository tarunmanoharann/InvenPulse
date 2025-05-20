import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category_id: string;
  unit_price: number;
  stock_quantity: number;
  reorder_point: number;
  supplier_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface ProductCreate {
  name: string;
  sku: string;
  description?: string;
  category_id: string;
  unit_price: number;
  stock_quantity: number;
  reorder_point: number;
  supplier_id: string;
  status?: 'active' | 'inactive';
  metadata?: any;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  category_id?: string;
  unit_price?: number;
  reorder_point?: number;
  supplier_id?: string;
  status?: 'active' | 'inactive';
  metadata?: any;
}

class ProductService {
  async getProducts(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    supplier_id?: string;
    status?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<{ items: Product[]; total: number }> {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  }

  async createProduct(product: ProductCreate): Promise<Product> {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  }

  async updateProduct(id: string, product: ProductUpdate): Promise<Product> {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`${API_URL}/products/${id}`);
  }

  async updateStock(id: string, quantity: number, type: 'increment' | 'decrement'): Promise<Product> {
    const response = await axios.post(`${API_URL}/products/${id}/stock`, {
      quantity,
      type,
    });
    return response.data;
  }

  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/products/low-stock`, {
      params: { threshold },
    });
    return response.data;
  }
}

export const productService = new ProductService(); 