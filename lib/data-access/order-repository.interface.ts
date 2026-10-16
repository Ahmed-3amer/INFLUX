import { Order } from '@/types/checkout';

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  save(order: Order): Promise<Order>;
}
