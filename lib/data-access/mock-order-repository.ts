import fs from 'fs';
import path from 'path';
import { Order } from '@/types/checkout';
import { OrderRepository } from './order-repository.interface';

/**
 * MockOrderRepository (Development & Preview Only)
 *
 * PERSISTENCE LIMITATIONS:
 * - Reads and writes orders to local JSON storage (data/orders.json).
 * - Development-only preview behavior; replaced by Supabase in the backend phase.
 */
export class MockOrderRepository implements OrderRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'orders.json');
  }

  async getAll(): Promise<Order[]> {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw) as Order[];
      }
    } catch (error) {
      console.error('[MockOrderRepository] Error reading orders file:', error);
    }
    return [];
  }

  async save(order: Order): Promise<Order> {
    const orders = await this.getAll();
    orders.unshift(order);

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(orders, null, 2), 'utf8');
    } catch (error) {
      console.error('[MockOrderRepository] Error saving order:', error);
      throw new Error('Failed to save order in local mock storage');
    }

    return order;
  }
}
