import { Product } from '@/types/product';
import { productRepository } from './data-access';

/**
 * Product Data Access Utilities
 *
 * All operations delegate through the ProductRepository contract.
 * During this frontend phase, MockProductRepository handles local development preview.
 * In the backend phase, this delegates cleanly to Supabase without requiring UI rewrites.
 */

export async function getProducts(): Promise<Product[]> {
  return productRepository.getAll();
}

export async function getProductById(id: string): Promise<Product | null> {
  return productRepository.getById(id);
}

export async function saveProduct(product: Product): Promise<Product> {
  return productRepository.save(product);
}

export async function deleteProduct(id: string): Promise<boolean> {
  return productRepository.delete(id);
}
