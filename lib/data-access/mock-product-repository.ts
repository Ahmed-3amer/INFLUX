import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import { ProductRepository } from './product-repository.interface';

/**
 * MockProductRepository (Development & Preview Only)
 *
 * PERSISTENCE LIMITATIONS:
 * - This repository reads and writes to local JSON storage (data/products.json)
 *   solely to enable local workflow preview for the store owner.
 * - This implementation is NOT suitable for production, serverless environments,
 *   or multi-user concurrency.
 * - In the future backend phase, this class will be replaced by a SupabaseProductRepository
 *   implementing the identical ProductRepository interface with PostgreSQL RLS security.
 */
export class MockProductRepository implements ProductRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'products.json');
  }

  async getAll(): Promise<Product[]> {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw) as Product[];
      }
    } catch (error) {
      console.error('[MockProductRepository] Error reading products file:', error);
    }
    return [];
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) || null;
  }

  async save(product: Product): Promise<Product> {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === product.id);

    if (index > -1) {
      products[index] = { ...products[index], ...product };
    } else {
      products.push(product);
    }

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
      console.error('[MockProductRepository] Error saving product:', error);
      throw new Error('Failed to save product in local mock storage');
    }

    return product;
  }

  async delete(id: string): Promise<boolean> {
    const products = await this.getAll();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return false; // Product not found
    }

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('[MockProductRepository] Error deleting product:', error);
      throw new Error('Failed to delete product from local mock storage');
    }
  }
}
