import { ProductRepository } from './product-repository.interface';
import { MockProductRepository } from './mock-product-repository';
import { OrderRepository } from './order-repository.interface';
import { MockOrderRepository } from './mock-order-repository';

export * from './product-repository.interface';
export * from './mock-product-repository';
export * from './order-repository.interface';
export * from './mock-order-repository';

// Export singleton instances for application use
export const productRepository: ProductRepository = new MockProductRepository();
export const orderRepository: OrderRepository = new MockOrderRepository();
